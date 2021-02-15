const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const delay = time =>
  new Promise(resolve => setTimeout(resolve, time))

const jitter = () =>
  Math.random() * 100

const loggerMiddleware = (ctx, next) => {
  console.log('Received request', ctx.url)
  return next()
}

const hello = ctx => {
  const name = ctx.params.name || 'World!'
  const time = parseInt(ctx.request.query.delay || 0) + jitter()
  return delay(time)
    .then(() => {
      ctx.set('X-Request-Delay', time)
      ctx.body = { greet: `Hello ${name}!` }
      ctx.status = 200
    })
}

const app = new Koa()
const router = new Router()

router.use(loggerMiddleware)
router.get('/hello', hello)
router.get('/hello/:name', hello)

app.use(bodyParser())
app.use(router.routes())

module.exports = app
