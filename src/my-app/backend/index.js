const couchbase = require('couchbase')
const { connectToCouchbase } = require('./db/connection')
async function main() {
  // Example usage
  return await ftsMatchWord('green day');


}

async function ftsMatchWord(term) {
  const { cluster } = await connectToCouchbase()

  const result = await cluster.searchQuery('event_shop._default.eventSearch', 
                                            couchbase.SearchQuery.match(term));

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

  return result

}



// Run the main function
main()
  .catch((err) => {
    console.log('ERR:', err)
    process.exit(1)
  })
  .then(process.exit)