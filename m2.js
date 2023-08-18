const amqp = require('amqplib');
const IsRunningInContainer = require('./containerUtils');

const QUEUE_NAME = 'tasks_queue';
var host = IsRunningInContainer() ? "rabbitmq" : "localhost";

async function processTask(task) {
  try {
    // Here we can put our processing code

    console.log(`Processing task: ${JSON.stringify(task)}`);
  } catch (error) {
    console.error('Error processing task:', error);
  }
}

async function startWorker() {
  try {
    const connection = await amqp.connect(`amqp://guest:guest@${host}:5672`);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('Worker is waiting for tasks...');

    channel.consume(QUEUE_NAME, (message) => {
      const task = JSON.parse(message.content.toString());

      processTask(task);

      channel.ack(message);
    });
  } catch (error) {
    console.error('Error starting worker:', error);
  }
}

startWorker();