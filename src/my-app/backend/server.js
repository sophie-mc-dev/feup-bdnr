import { app } from './app.js'

const startApiServer = async () => {
  const port = 3000
  app.listen(port, () => {
    console.log(`API started at http://localhost:${port}`)
  })
}

startApiServer()
