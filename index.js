const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

const host = process.env.MQTT_HOST || 'localhost';
const port = process.env.MQTT_PORT || '1883';
const username = process.env.MQTT_USERNAME || '';
const password = process.env.MQTT_PASSWORD || '';
const topic = process.env.MQTT_TOPIC || 'logger/#';

const client = mqtt.connect(`mqtt://${host}:${port}`, {
  username,
  password,
  reconnectPeriod: 5000,
  connectTimeout: 30 * 1000
});

function getLogFilePath() {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return path.join(__dirname, 'logs', `mqtt-${date}.log`);
}

function writeLog(message) {
  const logPath = getLogFilePath();
  const line = `${message}\n`;

  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFileSync(logPath, line);
}

client.on('connect', () => {
  console.log(`Connected to MQTT broker at ${host}:${port}`);
  client.subscribe(topic, (err) => {
    if (err) console.error(`Subscribe error: ${err}`);
    else console.log(`Subscribed to topic: ${topic}`);
  });
});

client.on('message', (_, message) => {
  writeLog(message.toString());
});