import http from 'k6/http'
import k6 from 'k6'

export default function () {
  // docker compose run --rm k6 run --vus 100 --iterations 3000 --rps 400  /app/test/loadtest_get_report.spec.ts

  const res = http.get(
    'http://app:3000/report?year_month_min=2022-04&year_month_max=2024-07',
    { headers: { 'Content-Type': 'application/json' } },
  )
  k6.metrics.add('response_time', res.timings.duration)
  k6.metrics.add('response_code', res.status)
}
