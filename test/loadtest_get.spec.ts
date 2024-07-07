import http from 'k6/http'
import { check } from 'k6'

export default function () {
  // docker compose run --rm k6 run --vus 100 --iterations 3000 --rps 400  /app/test/loadtest_get.spec.ts

  const res = http.get('http://app:3000/')

  check(res, {
    'Status 200': (res) => [200].includes(res.status),
  })
}
