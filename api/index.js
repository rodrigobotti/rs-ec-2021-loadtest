const app = require('./app')

const port = parseInt(process.env.PORT || 3000)

app
  .listen(3000)
  .once('listening', () =>
    console.log(`Server listening at ${port}`)
  )
  .once('error', err => {
    console.error('Failed to start server', err)
    process.exit(1)
  })
