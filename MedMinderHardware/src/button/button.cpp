#include "./global/globals.h"
#include <Arduino.h>

static const unsigned long DEBOUNCE_DELAY = 50;
static int lastStableState = HIGH;
static int lastReading     = HIGH;
static unsigned long lastDebounceTime = 0;

void buttonSetup() {
  pinMode(D7, INPUT_PULLUP);  
}

void takeMedicine() {
  medicineTaken = true;
}

void buttonLoop() {
  int reading = digitalRead(D7);

  if (reading != lastReading) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > DEBOUNCE_DELAY) {
    if (reading != lastStableState) {
      lastStableState = reading;

      if (lastStableState == LOW && !medicineTaken) {
        takeMedicine();
      }
    }
  }

  lastReading = reading;
}