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

    // Print DHT11 values in the expected format
    Serial.print("Humidity: ");
    Serial.print(DHT.humidity);
    Serial.print("\nTemperature: ");
    Serial.print(DHT.temperature);
    Serial.print("\nCO2-Value: ");
    Serial.print(mq135Value);
    Serial.print("\n");

    delay(2000); // Wait 2 seconds before accessing sensors again
}