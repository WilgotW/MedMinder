#include <Arduino.h>
#include "./global/globals.h"

void step();
void reset();

void step() {
  if (rotation <= 0) {
    delay(1000);
    reset();
  } else {
    // take step
    float startRotation = rotation;
    float targetRotation = rotation - stepAmount;

    if (targetRotation <= 0) {
      targetRotation = 0;
    }

    // smooth rotation
    int subSteps = 10;
    float subStepAmount = (startRotation - targetRotation) / subSteps;

    for (int i = 0; i < subSteps; i++) {
      float rotationAmount = startRotation - (i + 1) * subStepAmount;
      int pulse = minPulse + (int)((rotationAmount / maxRotation) * (maxPulse - minPulse));
      servo.writeMicroseconds(pulse);
      delay(20);
    }

    rotation = targetRotation;
    delay(2000);
  }
}

void reset() {
  rotation = maxRotation;
  servo.writeMicroseconds(maxPulse);
  Serial.println("Återställer till maxRotation.");
  delay(10000);
}