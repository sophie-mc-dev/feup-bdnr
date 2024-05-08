const couchbase = require('couchbase')

async function main() {
  // Example usage
  return await ftsMatchWord('green');


}

async function ftsMatchWord(term) {
  const clusterConnStr = 'couchbase://localhost'
  const username = 'Administrator'
  const password = 'password'
  const bucketName = 'event_shop'

  const cluster = await couchbase.connect(clusterConnStr, {
    username: username,
    password: password,
  })

  const result = await cluster.searchQuery('event_shop._default.eventSearch', couchbase.SearchQuery.match(term),
  {
    limit: 10,
  }
  )

  const bucket = cluster.bucket(bucketName);


  // Query the events collection for each document in the result
  for (const row of result.rows) {
    const docId = row.id;
    query = `SELECT event_id, artists,event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price 
      FROM event_shop._default.events 
      WHERE META().id = $1 AND MILLIS(date) >= NOW_MILLIS()
      ORDER BY MILLIS(date) ASC`
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