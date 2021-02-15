import http from 'k6/http'
import { Trend, Counter } from 'k6/metrics'
import { check, sleep } from 'k6'

// config

const config = {
  BASE_URL: __ENV.BASE_URL || 'https://yym1wupb2a.execute-api.us-east-1.amazonaws.com', // || 'http://localhost:3000',
  POSSIBLE_NAMES: [
    'rocketseat',
    'zedelivery',
    'experts',
    'club',
  ],
}

// helpers

const randomElement = xs =>
  xs[Math.floor(Math.random() * xs.length)]

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

// checks

const checks = response => {
  check(response, {
    isJSON: r => r.headers['Content-Type'] && r.headers['Content-Type'].startsWith('application/json'),
    hasGreet: r => r.json('greet'),
    is200: r => r.status === 200,
  })
  return response
}

// metrics

const Duration = new Trend('x_request_delay')
const ServerError = new Counter('server_errors')

const capitalizeFirst = ([first, ...rest]) =>
  `${first.toUpperCase()}${rest.join('').toLowerCase()}`

const toHeaderName = name =>
  name.split('-').map(capitalizeFirst).join('-')

const getHeader = (name, response) =>
  response.headers[name] || response.headers[toHeaderName(name)]

const report = response => {
  const durationHeader = getHeader('x-request-delay', response)
  const duration = parseFloat(durationHeader)
  if (duration) {
    Duration.add(duration)
  }
  if (response.status >= 500 && response.status < 600) {
    ServerError.add(1)
  }
  return response
}

// requests

const get = ({ name, delay } = {}) => {
  const nameParam = name || ''
  const delayParam = delay || 0
  const url = `${config.BASE_URL}/hello/${nameParam}?delay=${delayParam}`
  const response = http.get(url)
  return checks(report(response))
}

// options

export const options = {
  stages: [
    { target: 1, duration: '1m' },
    { target: 2, duration: '1m' },
    { target: 1, duration: '1m' },
  ],
  thresholds: {
    server_errors: ['count<=5'],
    x_request_delay: ['p(95)<=300'],
  },
}

// executions

export default () => {
  get()
  sleep(randomInt(1, 2))

  get({ name: randomElement(config.POSSIBLE_NAMES) })
  sleep(randomInt(1, 2))

  get({
    name: randomElement(config.POSSIBLE_NAMES),
    delay: randomInt(100, 500),
  })
}
