import http from 'k6/http'
import { Trend, Counter } from 'k6/metrics'
import { check } from 'k6'

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
  const BASE_URL = 'https://yym1wupb2a.execute-api.us-east-1.amazonaws.com'
  // const BASE_URL = 'http://localhost:3000'
  const response = http.get(`${BASE_URL}/hello`)
  checks(report(response))
}
