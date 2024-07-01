## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

1. Make sure docker compose is installed

## Running the app

```bash
# development with watch mode
$ make run-development-server

# production mode (TODO)
$ npm run start:prod
```

## Test

```bash
# unit tests (TODO)
$ npm run test

# test coverage (TODO)
$ npm run test:cov
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

## License

[MIT licensed](LICENSE).
