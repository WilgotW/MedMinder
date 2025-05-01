#include <Arduino.h>
#include "./global/globals.h"
#include "alarm.h"

void alarmSetup(){
    pinMode(audioSource, OUTPUT);
    delay(200);
}
void soundAlarm(){
    for(int i = 0; i < 3; i++){
        digitalWrite(audioSource, HIGH);
        delay(2000);
        digitalWrite(audioSource, LOW);
        delay(2000);
    }
}