#include <Arduino.h>
#include "globals.h"
#include "wheelLogic.h"

void setup() {
  Serial.begin(115200);
  servo.attach(13, minPulse, maxPulse);
  servo.writeMicroseconds(minPulse);
  delay(10000);
}

void loop() {
  step();
}