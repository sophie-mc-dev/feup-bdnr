const { connectToCouchbase } = require('../db/connection');

async function getUpcomingEvents(req, res) {
  const query =  `
  SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
  FROM events
  WHERE MILLIS(date) >= NOW_MILLIS()
  ORDER BY MILLIS(date)
`;
  
  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.scope("_default").query(query);
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
      res.json(result.value);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function filter(req, res) {
  const {category, location, event_date, sortBy } = req.query;

  let query;
  let query_params = [];

  query = `
    SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
    FROM events
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

  if (sortBy === "date") { 
    query += ' ORDER BY MILLIS(date) ASC';
  } else if (sortBy === "popularity") { 
    query += ' ORDER BY num_likes DESC, date ASC, event_name ASC';
  } else if (sortBy === "price_asc") {
    query += ' ORDER BY ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) ASC, date ASC, event_name ASC';
  } else if (sortBy === "price_desc") {
    query += ' ORDER BY ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) DESC, date ASC, event_name ASC';
  } 

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

module.exports = {
  getUpcomingEvents,
  getEventById,
  filter,
  getLikedEventsByUserId,
  getPastEventsByOrganizationId,
  getUpcomingEventsByOrganizationId
};
