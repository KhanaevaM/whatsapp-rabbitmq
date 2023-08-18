const axios = require('axios');
const IsRunningInContainer = require('./containerUtils');

const sendInterval = 5000;
var counter = 0;
var host = IsRunningInContainer() ? "m1" : "localhost";

async function sendPostRequest() {
  try {
    const response = await axios.post(`http://${host}:3000/process`, {
      data: `${counter++} - message`,
    });

    console.log(`Response: ${response.data.message}`);
  } catch (error) {
    console.error('Error sending POST request:', error.message);
  }
}

setInterval(sendPostRequest, sendInterval);
