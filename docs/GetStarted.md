## Get Started Bloom Guide

First step must be to create a .env file in the root folder with the following variables:

```bash
POSTGRES_USER=root
POSTGRES_PASSWORD=root
POSTGRES_DB=mydatabase
PAYMENT_GATEAWAY=http://localhost:3000/order
API_URL=http://localhost:8000
MODE=PROD
ETHERSCAN_API_KEY=YOUR_API_KEY
SNOWTRACE_API_KEY=YOUR_API_KEY
POLYGONSCAN_API_KEY=YOUR_API_KEY
```

All this commands must be run in the root folder of the monorepo

## Running docker instances 🐳

### Building the different docker images (PostesSQL,Api,Payment Gateaway)

```bash
yarn docker
```

## Creating the instances and running the compose

```bash
yarn compose
```

Great! Now you have the different instances running in your local machine.

Access to the different instances:

- [Payment Gateaway](http://localhost:3000)
- [Api Controller](http://localhost:8000/explorer)
- [PGAdmin](http://localhost:5050) (email address: admin@admin.com, password: root)

## Creating the migrations for PostgreSQL 🐘

```bash
yarn migrate
```

## Running each individual package (payment-gateaway,api-controller)

If you want to run each individual packages without the docker container, you must run the following commands in the root folder of the monorepo

## Payment-gateaway

## Initial setup

Inside the payment-gateaway folder

```bash
yarn
```

create a .env.local with following variables

```bash
API_URL=http://localhost:8000
MODE=PROD
```

And then run

```bash
yarn dev
```

### Api-controller

#### Initial setup

Inside the api-controller folder

```bash
yarn
```

create a .env.local with following variables

```bash
PAYMENT_GATEAWAY=http://localhost:3000/order
MODE=PROD
ETHERSCAN_API_KEY=YOUR_API_KEY
SNOWTRACE_API_KEY=YOUR_API_KEY
POLYGONSCAN_API_KEY=YOUR_API_KEY
POSTGRES_USER=root
POSTGRES_PASSWORD=root
POSTGRES_DB=mydatabase
POSTGRES_PORT=5432
POSTGRES_HOST=localhost

```

And then run

```bash
yarn dev
```
