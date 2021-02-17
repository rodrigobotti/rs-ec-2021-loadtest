import http from 'k6/http'

const config = {
  // variável de ambiente LOCAL_API_URL definida em docker-compose.yml (services -> k6 -> environment)
  BASE_URL: __ENV.LOCAL_API_URL || 'http://api:3000',
}

export const options = {
  stages: [
    { target: 1, duration: '5s' },
  ],
}

export default () => {
  http.get(`${config.BASE_URL}/hello`)
}
