## Description

Handles the backend data integration for consumers and candy products.

## Architecture

```mermaid
graph LR
subgraph Client
    A[Web/Mobile App]
end
subgraph API Layer
    B[REST API]
end
subgraph Application Layer
    C[Controllers] --> D[Use Cases]
end
subgraph Domain Layer
    D[Use Cases] --> E[Entities]
end
subgraph Infrastructure Layer
    D[Use Cases] --> F[Repositories]
end
subgraph Database Layer
    F[Repositories] --> G[(MySQL Database)]
end

A --> B
B --> C
```

## Containerization

```mermaid
graph LR
subgraph Host Machine
    A[App code]
    E[localhost:3000]
end

subgraph Docker Containers
    B[db-data]
    C[app]
    D[db]
end

A -- COPY --> C
B -- VOLUME --> D
C -- TCP 3306 --> D
E -- HTTP --> C
```

## Setup

1. Make sure docker compose is installed

```bash
# copy and fix environment variables
cp .env.sample .env

```

## Running the app

```bash
# development with watch mode
make run-development-server

# production mode (TODO)
npm run start:prod
```

## Test & Lint

```bash
# lint
$ make lint

# unit tests
$ make test

# test coverage
$ make test-cov
```

## Migrations
```bash
# apply migrations
docker compose exec app npm run migration:run

# revert migrations
docker compose exec app npm run migration:revert

# create new migration
docker compose exec app npm run migration:create --name=your_migration_name

# generate migration
docker compose exec app npm run migration:generate --name=your_migration_name
```

## Pre-commit hooks

```sh
# Sets husky pre-commit hooks
npm run prepare
```

## Database schema
```mermaid
erDiagram

Inventory ||--o{ Order : has
Store ||--o{ Order : has
Customer ||--o{ Order : places

Inventory {
    int id PK
    varchar name
    date manufactured_at
    int quantity
}

Store {
    int id PK
    varchar address
    varchar manager_name
}

Customer {
    int id PK
    varchar name
}

Order {
    int id PK
    int customer_id FK
    int inventory_id FK
    int store_id FK
    int quantity
    varchar status
    date created_at
    date updated_at
}
```

## API Endpoints

| HTTP Method | Endpoint               | Description                       |
|-------------|------------------------|-----------------------------------|
| GET         | [/customers](#get-customers) | List all customers          |
| POST        | [/customers](#post-customers) | Create a new customer |
| GET         | [/customers/:id](#get-customersid) | View a specific customer by ID    |
| PUT         | [/customers/:id](#put-customersid) | Modify customer by ID |
| GET         | [/stores](#get-stores)       | List all stores             |
| POST        | [/stores](#post-stores)      | Create a new store          |
| GET         | [/stores/:id](#get-storesid) | View a specific store by ID |
| PUT         | [/stores/:id](#put-storesid) | Modify store by ID          |
| GET         | [/inventories](#get-inventories)       | List all inventories            |
| POST        | [/inventories](#post-inventories)      | Create a new inventory          |
| GET         | [/inventories/:id](#get-inventoriesid) | View a specific inventory by ID |
| PUT         | [/inventories/:id](#put-inventoriesid) | Modify inventory by ID          |

### GET /customers

Retrieves a list of all customers. Ordered by ID ascending.

**Query Parameters:**

* offset (optional): Offset number (default: 0)
* limit (optional): Number of customers per page (default: 10. Max 100)

**Response (200 OK):**

```json
{
  "result": [
    {
      "id": 16,
      "name": "Best Buy112"
    }
  ],
  "pagination": {
    "offset": 15,
    "limit": 5,
    "total": 16
  }
}
```

### POST /customers

Creates a new customer

**Payload**
```json
{ "name": "PharmaSave" }
```

**Response (201 OK):**

```json
{ "id": 1, "name": "PharmaSave" },
```

### GET /customers/:id

View customer by id

**Response (200 OK):**

```json
{ "id": 1, "name": "Foot Locker"}
```

**Response (404 Not found):**

```json
{"message":"Not found","error":"Not Found","statusCode":404}
```

### PUT /customers/:id

Updates a customer by ID.

**Payload**

```js
{
  "name": "John Smith" // Updated name
}
```

**Response (200 OK):**

```js
{
  "id": 1,
  "name": "John Smith" // Updated customer
}
```

**Response (404 Not found):**

```json
{"message":"Not found","error":"Not Found","statusCode":404}
```

### GET /stores

Retrieves a list of all stores. Ordered by ID ascending.

**Query Parameters:**

-   offset (optional): Offset number (default: 0)
-   limit (optional): Number of stores per page (default: 10. Max 100)

**Response (200 OK):**

```json
{
  "result": [
    {
      "id": 1,
      "address": "123 Main St",
      "manager_name": "John Doe"
    }
  ],
  "pagination": {
    "offset": 0,
    "limit": 10,
    "total": 1
  }
}
```

### POST /stores

Creates a new store

**Payload**

```json
{ "address": "456 Elm St", "manager_name": "Jane Doe" }
```

**Response (201 OK):**

```json
{ "id": 2, "address": "456 Elm St", "manager_name": "Jane Doe" },
```

### GET /stores/:id

View store by id

**Response (200 OK):**
```json
{ "id": 1, "address": "123 Main St", "manager_name": "John Doe"}

```

**Response (404 Not found):**

```json
{"message":"Not found","error":"Not Found","statusCode":404}
```

### PUT /stores/:id

Updates a store by ID.

**Payload**

```js
{
  "manager_name": "Updated Manager" // Updated manager name
}
```

**Response (200 OK):**

```js
{
  "id": 1,
  "address": "789 Oak St",
  "manager_name": "Updated Manager" // Updated manager name
}
```

**Response (404 Not found):**

```json
{"message":"Not found","error":"Not Found","statusCode":404}
```

### GET /inventories

Retrieves a list of all inventories. Ordered by ID ascending.

**Query Parameters:**

* offset (optional): Offset number (default: 0)
* limit (optional): Number of inventories per page (default: 10. Max 100)

**Response (200 OK):**

```json
{
  "result": [
    {
      "id": 1,
      "name": "SmartiesBoxTruck",
      "manufactured_at": "2023-10-26T00:00:00.000Z",
      "quantity": 100
    },
    {
      "id": 2,
      "name": "CandyCornRv",
      "manufactured_at": "2023-10-27T00:00:00.000Z",
      "quantity": 50
    }
  ],
  "pagination": {
    "offset": 0,
    "limit": 10,
    "total": 2
  }
}
```

### POST /inventories

Creates a new inventory

**Payload**

```json
{ "name": "CandyCornRv", "manufactured_at": "2023-10-27T00:00:00.000Z", "quantity": 50 }
```

**Response (201 OK):**

```json
{ "id": 3, "name": "CandyCornRv", "manufactured_at": "2023-10-27T00:00:00.000Z", "quantity": 50 },
```

### GET /inventories/:id

View inventory by id

**Response (200 OK):**

```json
{ "id": 1, "name": "SmartiesBoxTruck", "manufactured_at": "2023-10-26T00:00:00.000Z", "quantity": 100}
```

**Response (404 Not found):**

```json
{"message":"Not found","error":"Not Found","statusCode":404}
```

### PUT /inventories/:id

Updates an inventory by ID.

**Payload**

```js
{
  "quantity": 150
}
```

**Response (200 OK):**

```js
{
  "id": 1,
  "name": "SmartiesBoxTruck",
  "manufactured_at": "2023-10-26T00:00:00.000Z",
  "quantity": 150 // Updated quantity
}
```

**Response (404 Not found):**

```json
{"message":"Not found","error":"Not Found","statusCode":404}
```


## License

[MIT licensed](LICENSE).
