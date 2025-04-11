#include <WiFi.h>
#include <HTTPClient.h>
#include "server.h"

void getDose();

const char* ssid = "Wilgots iPhone";
const char* password = "Wilgot2005";
const char* serverURL = "https://focused-smile-production.up.railway.app/api/doses/";

void serverSetup() {
  WiFi.begin(ssid, password);
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
    http.begin(serverURL);
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