#include <ArduinoJson.h>
#include "dht.h"

#define dht_apin A0 // Analog Pin for DHT11 sensor
#define mq135_apin A1 // Analog Pin for MQ-135 sensor

dht DHT;

void setup() {
    Serial.begin(9600);
    delay(500); // Delay to let the system boot
    Serial.println("DHT11 Humidity & Temperature Sensor with MQ-135 CO2 Sensor\n\n");
    delay(1000); // Wait before accessing sensors
}

void loop() {
    // Read DHT11 sensor
    DHT.read11(dht_apin);
    
    // Read MQ-135 sensor
    int mq135Value = analogRead(mq135_apin);

    // Create a JSON object
    StaticJsonDocument<200> doc; // Adjust size as needed
    doc["humidity"] = DHT.humidity;
    doc["temperature"] = DHT.temperature;
    doc["co2Value"] = mq135Value;

    // Serialize the JSON object to a string
    String jsonString;
    serializeJson(doc, jsonString);

    // Send the JSON string to the serial port
    Serial.println(jsonString);

    delay(2000); // Wait 2 seconds before accessing sensors again
}