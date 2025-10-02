const mqtt = require("mqtt");
const winston = require("winston");
require("winston-daily-rotate-file");
const fs = require("fs");
const path = require("path");
const logDir = path.join(__dirname, "logs");
fs.mkdirSync(logDir, { recursive: true });

const { combine, printf } = winston.format;
// Define a custom format that outputs only the message
const plainFormat = printf((info) => `${info.message}`);

const transport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "mqtt-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxFiles: "10d",
  level: "info",
  format: plainFormat,
});

const logger = winston.createLogger({
  transports: [transport],
  level: "info",
});

const client = mqtt.connect(
  `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
  {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  }
);

client.on("connect", () => {
  console.log("Connecting...");
  client.subscribe(`${process.env.MQTT_TOPIC}`);
});

client.on("message", (topic, message) => {
  console.log(`Received message: ${message}`);
  logger.info(message.toString());
});
