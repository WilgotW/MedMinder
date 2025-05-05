// wheelLogic.cpp

#include <Arduino.h>
#include <Servo.h>
#include "./global/globals.h"
#include "./alarm/alarm.h"

extern Servo servo;

void reset();
void step();

void reset() {
  rotation = maxRotation;
  servo.writeMicroseconds(maxPulse);
  medicineTaken = false;
}

void step() {
  if (rotation <= 0) {
    // reached bottom: pause, reset
    unsigned long start = millis();
    while (millis() - start < 1000) {
      // non-blocking wait if you need other loops
    }
    medicineTaken = false;
    reset();
    return;
  }

  float startRot = rotation;
  float targetRot = max(0.0f, rotation - stepAmount);

  // break into substeps
  const int subSteps = 10;
  float delta = (startRot - targetRot) / subSteps;
  for (int i = 1; i <= subSteps; ++i) {
    float r = startRot - i * delta;
    int pulse = minPulse + int((r / maxRotation) * (maxPulse - minPulse));
    servo.writeMicroseconds(pulse);
    delay(20);
  }

  rotation = targetRot;
  delay(2000);
}

