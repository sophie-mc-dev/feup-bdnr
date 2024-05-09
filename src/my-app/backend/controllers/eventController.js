const { connectToCouchbase } = require('../db/connection');

async function getUpcomingEvents(req, res) {
  const offset = parseInt(req.query.offset);
  const query =  `
  SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
  FROM events
  WHERE MILLIS(date) >= NOW_MILLIS()
  ORDER BY MILLIS(date)
  LIMIT 8
  OFFSET $1
`;
  const options = {parameters: [offset]};
  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.scope("_default").query(query, options);
    res.json(result.rows.map(row => row));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getEventById(req, res) {
  let eventId = req.params.event_id;

  try {
    const { eventsCollection } = await connectToCouchbase();
    const result = await eventsCollection.get(eventId);
    if (!result) {
      res.status(404).send('Event not found');
    } else {
      // get the total revenue from the event too
      const query = `
        SELECT event.event_id, event.event_name, SUM(item.ticket_price * item.quantity) AS total_income
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.event_id = $1
        GROUP BY event.event_id, event.event_name
      `
      const options = { parameters: [eventId] };
      const { cluster } = await connectToCouchbase();
      const revenue = await cluster.query(query, options);
      result.value.total_income = revenue.rows[0].total_income;
      res.json(result.value);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function ftsMatchWord(term) {
  const { cluster, couchbase } = await connectToCouchbase()

  const result = await cluster.searchQuery('event_shop._default.eventSearch', 
                                            couchbase.SearchQuery.match(term));

  /*
  // Query the events collection for each document in the result
  for (const row of result.rows) {
    const docId = row.id;
    query = `SELECT event_id, description, artists, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price 
      FROM event_shop._default.events 
      WHERE event_id = $1`
    const queryResult = await cluster
      .query(query, {
        parameters: [docId],
      })
    console.log('QUERY RESULT', queryResult.rows)
  }
  */

  return result

}

async function filter(req, res) {
  const {category, location, event_date, sortBy, search, offset } = req.query;

  let query;
  let query_params = [];
  query = `
    SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
    FROM event_shop._default.events 
  `;

  if (event_date.trim().length !== 0) {
    query_params.push(event_date);
    query += ` WHERE DATE_FORMAT_STR(date, '1111-11-11') = $` + query_params.length;
  }

  else {
      query += ` WHERE MILLIS(date) >= NOW_MILLIS()`;
  }
  
  if (category.trim().length !== 0) {
    query_params.push(category)
    query += ' AND $' + query_params.length + ' IN categories';
  }

  if (location.trim().length !== 0) { 
    query_params.push(location)
    query += ' AND location = $' + query_params.length;
  }

  if(search.trim().length !== 0) {
    const result = await ftsMatchWord(search);

    for(const row of result.rows) {
      const docId = row.id;
      query_params.push(docId);
      // if it's the last element, remove the OR
      if (docId === result.rows[result.rows.length - 1].id) {
        query += ` event_id = $` + query_params.length + ')';
      } // else if it's the first element, add the AND
      else if (docId === result.rows[0].id) {
        query += ` AND (event_id = $` + query_params.length + ' OR';
      } // else add the OR
      else {
        query += ` event_id = $` + query_params.length + ' OR';
      }
    }
  }

  if (sortBy === "date") { 
    query += ' ORDER BY MILLIS(date) ASC';
  } else if (sortBy === "popularity") { 
    query += ' ORDER BY num_likes DESC, date ASC, event_name ASC';
  } else if (sortBy === "price_asc") {
    query += ' ORDER BY ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) ASC, date ASC, event_name ASC';
  } else if (sortBy === "price_desc") {
    query += ' ORDER BY ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) DESC, date ASC, event_name ASC';
  } 

  // Limit the number of results to 8
  query_params.push(parseInt(offset))
  query += ' LIMIT 8 OFFSET $' + query_params.length;

  const options = { parameters: query_params };
  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.defaultScope().query(query, options);
    if (!result) {
      res.status(404).send('Events not found');
    } else {
      res.json(result.rows.map(row => row));
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getLikedEventsByUserId(req, res) {
  const user_id = req.params.user_id;
  const query = `
    SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
    FROM events
    WHERE ARRAY_CONTAINS (
      (SELECT RAW event_id 
      FROM users as u
      UNNEST liked_events AS event_id
      WHERE u.user_id = $1), 
      event_id    
    )`
  ;
  const options = {parameters: [user_id]}

  try {
      const { bucket } = await connectToCouchbase();
      const result = await bucket.defaultScope().query(query, options);
      res.json(result.rows);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
}

async function getPastEventsByOrganizationId(req, res) {
  const user_id = req.params.user_id;
  const query = `
    SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
    FROM events
    WHERE organization_id=$1 AND MILLIS(date) < NOW_MILLIS()
    ORDER BY MILLIS(date) DESC
  `;
  const options = {parameters: [user_id]}

  try {
      const { bucket } = await connectToCouchbase();
      const result = await bucket.defaultScope().query(query, options);
      res.json(result.rows);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
}

async function getUpcomingEventsByOrganizationId(req, res) {
  const user_id = req.params.user_id;
  const query = `
    SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
    FROM events
    WHERE organization_id=$1 AND MILLIS(date) >= NOW_MILLIS()
    ORDER BY MILLIS(date) ASC
  `;
  const options = {parameters: [user_id]}

  try {
      const { bucket } = await connectToCouchbase();
      const result = await bucket.defaultScope().query(query, options);
      res.json(result.rows);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
}

async function getEventsByArtistId(req, res) {
  const artistId = req.params.artist_id;
  const query = `
    SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
    FROM events
    WHERE ARRAY_CONTAINS (
      (SELECT RAW event_id 
      FROM artists as a
      UNNEST a.event_ids AS event_id
      WHERE a.artist_id = $1), 
      event_id    
    )
    ORDER BY MILLIS(date) ASC`
  ;
  const options = {parameters: [artistId]}

  try {
      const { bucket } = await connectToCouchbase();
      const result = await bucket.defaultScope().query(query, options);
      res.json(result.rows);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  getUpcomingEvents,
  getEventById,
  filter,
  getLikedEventsByUserId,
  getPastEventsByOrganizationId,
  getUpcomingEventsByOrganizationId,
  getEventsByArtistId
};
