#include <Arduino.h>
#include "globals.h"
#include "wheelLogic.h"
#include "server.h"

void setup() {
  Serial.begin(115200);
  Serial.println("Hello!");

  serverSetup(); 

  servo.attach(13, minPulse, maxPulse);
  servo.writeMicroseconds(minPulse);
  delay(10000);
}

void loop() {
  serverLoop(); 

  //step();
}