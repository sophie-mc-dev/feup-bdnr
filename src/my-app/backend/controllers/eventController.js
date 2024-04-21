const { connectToCouchbase } = require('../db/connection');

async function getUpcomingEvents(req, res) {
  const query = 'SELECT * FROM `events` WHERE MILLIS(date) >= NOW_MILLIS() ORDER BY MILLIS(date) ASC';
  
  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.scope("_default").query(query);
    res.json(result.rows.map(row => row.events));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getEventById(req, res) {
  let eventId = req.params.event_id;
  const { eventsCollection } = await connectToCouchbase();

  try {
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

async function filterAndOrderEvents(req, res) { // TODO: complete using date
  const category = req.params.category;
  const location = req.params.location;

  const query = 'SELECT * FROM `events` WHERE $1 IN categories AND $2 IN location';
  const options = { parameters: [category, location] };
  try {
    const result = await bucket.defaultScope().query(query, options);
    if (!result) {
        res.status(404).send('Event not found');
    } else {
        res.json(result.value);
        result.rows.forEach((row) => {
            console.log(row)
        });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
    getUpcomingEvents,
    getEventById,
    filterAndOrderEvents
};
