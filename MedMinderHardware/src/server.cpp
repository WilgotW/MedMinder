#include <WiFi.h>
#include <HTTPClient.h>
#include "server.h"
#include "../secrets.h"

void getDose();

void serverSetup() {
  WiFi.begin(SSID, PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
  
  getDose();
}

void serverLoop() {
  delay(30000);
}

void getDose(){
    HTTPClient http;
    http.begin(SERVER_URL);
    
    int httpResponseCode = http.GET();
    if (httpResponseCode > 0) {
        String payload = http.getString();
        Serial.println("Response:");
        Serial.println(payload);
    } else {
        Serial.print("Error on HTTP request: ");
        Serial.println(httpResponseCode);
    }
    http.end();
}