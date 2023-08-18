const amqp = require('amqplib');
const IsRunningInContainer = require('./containerUtils');

const TASKS_QUEUE_NAME = 'tasks_queue';
const RESPONSES_QUEUE_NAME = 'responses_queue';
var host = IsRunningInContainer() ? "rabbitmq" : "localhost";

// connect to RabbitMQ and send respons to queue
async function sendResponseToQueue(response) {
  try {
    const connection = await amqp.connect(`amqp://${host}`);
    const channel = await connection.createChannel();

    await channel.assertQueue(RESPONSES_QUEUE_NAME, { durable: true });
    await channel.sendToQueue(RESPONSES_QUEUE_NAME, Buffer.from(JSON.stringify(response)));

    console.log(`Response sent to queue: ${JSON.stringify(response)}`);
    setTimeout(() => connection.close(), 500);
  } catch (error) {
    console.error('Error sending response to queue:', error);
  }
}

async function processTask(task) {
  try {
    console.log(`Processing task: ${JSON.stringify(task)}`);

    // Here we can put our processing code
    const response = {"data": `'${task.data}' is proccessed.`};

    sendResponseToQueue(response);

  } catch (error) {
    console.error('Error processing task:', error);
  }
}

async function startWorker() {
  try {
    const connection = await amqp.connect(`amqp://guest:guest@${host}:5672`);
    const channel = await connection.createChannel();

    await channel.assertQueue(TASKS_QUEUE_NAME, { durable: true });
    console.log('Worker is waiting for tasks...');

    channel.consume(TASKS_QUEUE_NAME, (message) => {
      const task = JSON.parse(message.content.toString());

      processTask(task);

      channel.ack(message);
    });
  } catch (error) {
    console.error('Error starting worker:', error);
  }
}

startWorker();