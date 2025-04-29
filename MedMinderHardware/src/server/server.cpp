#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "server.h"
#include "../secrets.h"
#include "./wheel/wheelLogic.h"
#include "./screen/screen.h"

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
  delay(3000);
  
}

void getDose() {
  HTTPClient http;
  http.begin(SERVER_URL);

  Serial.print("next");

  int httpResponseCode = http.GET();
  if (httpResponseCode > 0) {
    String payload = http.getString();
    Serial.println("Response:");
    Serial.println(payload);

    StaticJsonDocument<256> doc;  
    DeserializationError error = deserializeJson(doc, payload);
    if (error) {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.f_str());
    } else {
      bool espDispensed = doc["espDispensed"];
      bool id = doc["id"];
      String medicineTitle = doc["medicine"];

      if(id){
        if (espDispensed == false) {
          step();
          screenLoop(medicineTitle);
        }
      }
    }
  } else {
    Serial.print("Error on HTTP request: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}