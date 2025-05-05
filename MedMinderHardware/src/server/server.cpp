#include "server.h"
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include "../secrets.h"
#include "../global/globals.h"
#include "../wheel/wheelLogic.h"
#include "../screen/screen.h"
#include "../alarm/alarm.h"
#include "../led/led.h"

// how often to poll (ms)
static unsigned long previousDoseMillis = 0;
static const unsigned long doseInterval = 5000;

void serverSetup() {
  Serial.begin(115200);
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
  unsigned long now = millis();
  if (now - previousDoseMillis >= doseInterval) {
    previousDoseMillis = now;
    getDose();
  }
}

void getDose() {
  HTTPClient http;
  WiFiClient  client;

  http.begin(client, SERVER_URL);
  int code = http.GET();

  if (code > 0) {
    String payload = http.getString();
    StaticJsonDocument<256> doc;
    if (deserializeJson(doc, payload) == DeserializationError::Ok) {
      bool espDispensed   = doc["espDispensed"];
      bool id             = doc["id"];
      String medicineTitle = doc["medicine"];

      if (id && !espDispensed) {
        medicineTaken = false;
        step();
        screenLoop(medicineTitle);
      }
    }
  } else {
    Serial.printf("HTTP error: %d\n", code);
  }

  http.end();
}