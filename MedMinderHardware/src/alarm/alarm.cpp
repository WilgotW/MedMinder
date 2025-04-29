#include <Arduino.h>
#include "./global/globals.h"
#include "alarm.h"

void soundAlarm(){
    for(int i = 0; i < 10; i++){
        digitalWrite(audioSource, HIGH);
        delay(2000);
        digitalWrite(audioSource, LOW);
        delay(2000);
    }
}