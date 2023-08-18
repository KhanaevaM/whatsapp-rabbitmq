const express = require('express');
const amqp = require('amqplib');
const IsRunningInContainer = require('./containerUtils');

const app = express();
const QUEUE_NAME = 'tasks_queue';

app.use(express.json());

var host = IsRunningInContainer() ? "rabbitmq" : "localhost";

// connect to RabbitMQ and send task to queue
async function sendTaskToQueue(task) {
  try {
    const connection = await amqp.connect(`amqp://${host}`);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(task)));

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

//setInterval(() => sendTaskToQueue({data: `some messgae`,}), 5000);