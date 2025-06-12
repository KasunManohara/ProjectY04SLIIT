const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require("cors");
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');

// User imports
const GSRoutes = require('./routes/GrowShedRoute');
const yPredictRoute = require('./routes/YieldPredictRoute');

dotenv.config();

mongoose.set('strictQuery', true);

// Middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database connection
const PORT = process.env.PORT || 8090;
const URL = process.env.DB_URL;

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connection success!");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

// Routes define to be used
app.use('/api/v1/growshed', GSRoutes);
app.use('/api/v1/predictyield', yPredictRoute);

// WebSocket server
const wss = new WebSocket.Server({ port: 8081 }, () => {
    console.log(`WebSocket server is running on port 8081`);
});

// Arduino sensor data
const arduinoPort = new SerialPort({
    path: 'COM5', 
    baudRate: 9600
});

const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// Handle incoming data from Arduino
parser.on('data', (data) => {
    try {
        // Parse the JSON string received from Arduino
        const sensorData = JSON.parse(data);
        console.log('Sensor Data:', sensorData);

        // Broadcast the sensor data to all connected WebSocket clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(sensorData));
            }
        });
    } catch (error) {
        console.error('Error parsing sensor data:', error);
    }
});

arduinoPort.on('error', (err) => {
    console.error('Error opening serial port:', err);
});

// Handle WebSocket connection events
wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});