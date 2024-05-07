const couchbase = require('couchbase')

async function main() {
  // Example usage
  const result = await ftsMatchWord('%health%');
  console.log('RESULT', result)

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

  return await cluster.searchQuery('event_shop._default.eventsSearch', couchbase.SearchQuery.match(term),
  {
    limit: 10,
  }
  )

}



// Run the main function
main()
  .catch((err) => {
    console.log('ERR:', err)
    process.exit(1)
  })
  .then(process.exit)