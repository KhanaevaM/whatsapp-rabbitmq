# App

An async HTTP requests processing App

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [RabbitMQ](https://www.rabbitmq.com/download.html)

or

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## With Docker

1. Сlone Docker image

```
git clone https://github.com/KhanaevaM/whatspp-rabbitmq
```
2. Run Docker

```
docker-compose up --build
```

## Without Docker

1. Сlone repo

```
git clone https://github.com/KhanaevaM/whatspp-rabbitmq
```

2. Install dependencies

```
npm install
```

3. Run locally all services

```
node m1 
```

```
node m2
```

```
node sender
```

4. Enjoy!