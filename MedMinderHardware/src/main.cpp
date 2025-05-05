#include <Arduino.h>

#include <Servo.h>
#include "./global/globals.h"
#include "./alarm/alarm.h"
#include "./screen/screen.h"
#include "./wheel/wheelLogic.h"
#include "./server/server.h"

Servo servo;

void setup() {
  servo.attach(D8, minPulse, maxPulse);
  servo.writeMicroseconds(minPulse);

  serverSetup();
  alarmSetup();
  screenSetup();
}

void loop() {
  updateScreen(); 
  soundAlarmLoop();
  serverLoop();
}