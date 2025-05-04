#include <Arduino.h>
#include "./global/globals.h"
#include "./wheel/wheelLogic.h"
#include "server.h"
#include "./alarm/alarm.h"
void setup() {
  Serial.begin(115200);
  // Serial.println("Hello!");

  //serverSetup(); 

  servo.attach(servoPin, minPulse, maxPulse);
  servo.writeMicroseconds(minPulse);
  delay(2000);
  // alarmSetup();
  // delay(1000);
  reset();
}

unsigned long previousMillis = 0;
const unsigned long interval = 2000; 

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    step();    
  }

}