#include <Arduino.h>
#include "./global/globals.h"
#include "./led/led.h"
#include "./server/server.h"
#include "./wheel/wheelLogic.h"

void setup() {
  Serial.begin(115200);

  wheelSetup(); 
  serverSetup();
}

void loop() {
}

