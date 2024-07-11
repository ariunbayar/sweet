import http from 'k6/http'
import { check } from 'k6'

export default function () {
  const payload = {
    customer_id: 2,
    inventory_id: 3,
    store_id: 2,
    quantity: 2,
    status: 'pending',
  }

  // docker compose run --rm k6 run --vus 100 --iterations 3000 --rps 400  /app/test/loadtest_post_orders.spec.ts

  const res = http.post('http://app:3000/orders', JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  check(res, {
    'Status 201 ': (res) => [201].includes(res.status),
  })
}
