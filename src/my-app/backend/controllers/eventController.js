const { connectToCouchbase } = require('../db/connection');

async function getUpcomingEvents(req, res) {
  const query =  `
  SELECT event_id, event_name, date, location, categories, artists, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
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

async function filter(req, res) { // TODO: complete using date
  const category = req.query.category;
  const location = req.query.location;
  const artist = req.query.artist;
  const sortBy = req.query.sortBy;

  let query = `
  SELECT event_id, event_name, date, location, categories, artists, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
  FROM events
  WHERE MILLIS(date) >= NOW_MILLIS()
  `;
  let query_params = [];

  if (category.trim().length !== 0) {
    query_params.push(category)
    query += ' AND $' + query_params.length + ' IN categories';
  }

  if (location.trim().length !== 0) { 
    query_params.push(location)
    query += ' AND location = $' + query_params.length;
  }

  if (artist.trim().length !== 0) {
    query_params.push(artist)
    query += ' AND $' + query_params.length + ' IN artists';
  }

  if (sortBy === "date") { 
    query += ' ORDER BY MILLIS(date) ASC';
  } else if (sortBy === "popularity") { 
    query += ' ORDER BY num_likes DESC';
  } else if (sortBy === "price_asc") {
    query += ' ORDER BY ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) ASC';
  } else if (sortBy === "price_desc") {
    query += ' ORDER BY ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) DESC';
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

module.exports = {
  getUpcomingEvents,
  getEventById,
  filter
};
