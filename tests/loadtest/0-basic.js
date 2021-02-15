import http from 'k6/http'

export const options = {
  stages: [
    { target: 1, duration: '1m' },
    { target: 2, duration: '1m' },
    { target: 1, duration: '1m' },
  ],
}

export default () => {
  const BASE_URL = 'https://yym1wupb2a.execute-api.us-east-1.amazonaws.com'
  // const BASE_URL = 'http://localhost:3000'
  http.get(`${BASE_URL}/hello`)
}
