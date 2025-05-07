#include <Arduino.h>

#include <Servo.h>
#include "./button/button.h"
#include "./global/globals.h"
#include "./alarm/alarm.h"
#include "./screen/screen.h"
#include "./wheel/wheelLogic.h"
#include "./server/server.h"

Servo servo;

void setup() {
  servo.attach(D8, minPulse, maxPulse);
  servo.writeMicroseconds(minPulse);

  screenSetup();
  reset();
  serverSetup();
  buttonSetup();
  alarmSetup();
}

void loop() {
  buttonLoop();
  updateScreen(); 
  //updateWheel();
  soundAlarmLoop();
  serverLoop();
}