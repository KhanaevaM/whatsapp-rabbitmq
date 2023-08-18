const express = require('express');
const amqp = require('amqplib');
const IsRunningInContainer = require('./containerUtils');

const app = express();
const TASKS_QUEUE_NAME = 'tasks_queue';
const RESPONSES_QUEUE_NAME = 'responses_queue';

app.use(express.json());

var host = IsRunningInContainer() ? "rabbitmq" : "localhost";

// connect to RabbitMQ and send task to queue
async function sendTaskToQueue(task) {
  try {
    const connection = await amqp.connect(`amqp://${host}`);
    const channel = await connection.createChannel();

    await channel.assertQueue(TASKS_QUEUE_NAME, { durable: true });
    await channel.sendToQueue(TASKS_QUEUE_NAME, Buffer.from(JSON.stringify(task)));

    console.log(`Task sent to queue: ${JSON.stringify(task)}`);
    setTimeout(() => connection.close(), 500);
  } catch (error) {
    console.error('Error sending task to queue:', error);
  }
}

app.post('/process', (req, res) => {
  const task = req.body;

  sendTaskToQueue(task);

  res.json({ message: 'Task accepted for processing.' });
});

app.listen(`3000`, () => {
  console.log(`Microservice M1 is running on http://${host}:3000`);
});

async function startWorker() {
  try {
    const connection = await amqp.connect(`amqp://guest:guest@${host}:5672`);
    const channel = await connection.createChannel();

    await channel.assertQueue(RESPONSES_QUEUE_NAME, { durable: true });
    console.log('Worker is waiting for responses...');

    channel.consume(RESPONSES_QUEUE_NAME, (message) => {
      const response = JSON.parse(message.content.toString());

      console.log(`Response got: ${JSON.stringify(response)}`);

      channel.ack(message);
    });
  } catch (error) {
    console.error('Error starting worker:', error);
  }
}

startWorker();