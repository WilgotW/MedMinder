#include <Arduino.h>
#include "./global/globals.h"
#include "alarm.h"

// Timing constants
static const unsigned long TOGGLE_INTERVAL = 250;   // Toggle every 0.5s
static const unsigned long PAUSE_DURATION  = 10000; // 10s pause after 5 beeps
static const int MAX_BEEPS = 5;

// State variables
static bool alarmActive = false;
static bool isBeeping   = false;
int  beepCount   = 0;

static unsigned long lastToggleTime = 0;
static unsigned long pauseStartTime = 0;
static bool outputState = false;

void alarmSetup() {
  pinMode(D6, OUTPUT);
  digitalWrite(D6, LOW);

  // Startup flash
  for (int i = 0; i < 2; i++) {
    digitalWrite(D6, HIGH);
    delay(100);
    digitalWrite(D6, LOW);
    delay(100);
  }

  alarmActive = true;
  isBeeping = true;
  beepCount = 0;
  lastToggleTime = millis();
}

void soundAlarmLoop() {
  if (!alarmActive || medicineTaken) {
    digitalWrite(D6, LOW);
    return;
  }


  unsigned long now = millis();

  if(beepCount <= 3){
    if (now - lastToggleTime >= TOGGLE_INTERVAL) {
      outputState = !outputState;
      digitalWrite(D6, outputState ? HIGH : LOW);
      lastToggleTime = now;
  
      if (!outputState) {
        beepCount++;
      }
    }
  }
    
}