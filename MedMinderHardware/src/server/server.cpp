#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <ArduinoJson.h>
#include "../secrets.h"
#include "../global/globals.h"
#include "../wheel/wheelLogic.h"
#include "../screen/screen.h"
#include "../alarm/alarm.h"

static unsigned long previousDoseMillis = 0;
static const unsigned long doseInterval = 5000;


void getDose() {
  WiFiClientSecure client;
  client.setInsecure();   

  HTTPClient http;
  Serial.println("[getDose] Requesting: " + String(SERVER_URL));
  http.begin(client, SERVER_URL);

  int code = http.GET();
  Serial.printf("[getDose] HTTP %d\n", code);

  String body = http.getString();
  Serial.println("[getDose] BODY: " + body);

  if (code == HTTP_CODE_OK) {
    StaticJsonDocument<256> doc;
    auto err = deserializeJson(doc, body);
    if (err) {
      Serial.print("[getDose] JSON parse error: ");
      Serial.println(err.f_str());
    } else {
      bool espDispensed   = doc["espDispensed"].as<bool>();
      int  idVal          = doc["id"].as<int>();
      const char *medName = doc["medicine"] | "<no title>";

      const char* t = doc["time"];
      nextDoseTime = t;

      Serial.printf("[getDose] id=%d dispensed=%s med=%s\n",
        idVal, espDispensed ? "true":"false", medName);

      if (idVal > 0 && !espDispensed) {
        Serial.println("[getDose] → dispensing!");
        nextDoseTime = "";
        beepCount = 0;
        medicineTaken = false;

        step();
        screenLoop(medName);
      }
    }
  }

  http.end();
}

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
  if (millis() - previousDoseMillis >= doseInterval) {
    previousDoseMillis = millis();
    getDose();
  }
}
