const { connectToCouchbase } = require('../db/connection');

async function getAllArtists(req, res) {
  const query = 'SELECT * FROM `artists` ORDER BY artist_name ASC';

  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.scope("_default").query(query);
    res.json(result.rows.map(row => row.artists));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getArtistById(req, res) {
  let artist_id = req.params.artist_id;

  try {
    const { artistsCollection } = await connectToCouchbase();
    const result = await artistsCollection.get(artist_id);
    if (!result) {
      res.status(404).send('Artist not found');
    } else {
      res.json(result.value);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getNames(req, res) {
  const query = 'SELECT artist_name FROM `artists` ORDER BY artist_name ASC';

  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.scope("_default").query(query);
    res.json(result.rows.map(row => row.artist_name));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  getAllArtists,
  getNames,
  getArtistById
};