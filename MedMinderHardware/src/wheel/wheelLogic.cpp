#include <Arduino.h>
#include "./global/globals.h"
#include "./alarm/alarm.h"

void step();
void reset();
#include <Arduino.h>
#include "./global/globals.h"
#include "./alarm/alarm.h"

void step();
void reset();

void step() {
    // If we’ve reached 0°, pause and reset back up
    if (rotation <= 0) {
      delay(1000);
      medicineTaken = false;
      reset();
    } else {
      // Compute next target by subtracting stepAmount
      float startRotation = rotation;
      float targetRotation = rotation - stepAmount;
      if (targetRotation <= 0) targetRotation = 0;
  
      // Smoothly interpolate in substeps
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
    // Jump back to the top (270°)
    soundAlarm();
    rotation = maxRotation;
    servo.writeMicroseconds(maxPulse);
    medicineTaken = false;  // optional flag
  }