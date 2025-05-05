#include <Arduino.h>
#include "./global/globals.h"
#include "alarm.h"


unsigned long lastAlarmTime = 0;
int alarmStage = 0;
bool alarmActive = false;

void alarmSetup() {
  pinMode(D6, OUTPUT);
  delay(1000);

  for (int i = 0; i < 2; i++) {
    digitalWrite(D6, HIGH);
    delay(100);
    digitalWrite(D6, LOW);
    delay(100);
  }

  alarmActive = true;
}

void soundAlarmLoop() {
  if (!alarmActive || medicineTaken) {
    digitalWrite(D6, LOW); 
    return;
  }

  unsigned long now = millis();

  if (alarmStage < 3) { 
    if (now - lastAlarmTime >= 200) {
      digitalWrite(D6, alarmStage % 2 == 0 ? HIGH : LOW);
      alarmStage++;
      lastAlarmTime = now;
    }
  } else {
    if (now - lastAlarmTime >= 1000) {
      alarmStage = 0;
      lastAlarmTime = now;
    }
  }
}