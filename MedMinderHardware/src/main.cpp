#include <Arduino.h>
#include "./global/globals.h"
#include "./led/led.h"
#include "./server/server.h"
#include "./wheel/wheelLogic.h"
#include "alarm/alarm.h"
#include "screen/screen.h"
#include <LiquidCrystal.h>
#include "./button/button.h"

void setup() {
  //screenSetup();
  //alarmSetup();
  // serverSetup();
  wheelSetup();
}

void loop() {
  //buttonLoop();
}

