#include <Arduino.h>
#include "./global/globals.h"
#include "alarm.h"



void alarmSetup(){
    pinMode(audioSource, OUTPUT);
    delay(100);

    for(int i = 0; i < 2; i++){
        digitalWrite(audioSource, HIGH);
        delay(50);
        digitalWrite(audioSource, LOW);
        delay(50);
    }
}

void soundAlarm(){
    while (medicineTaken == false){
        for(int i = 0; i < 5; i++){
            digitalWrite(audioSource, HIGH);
            delay(200);
            digitalWrite(audioSource, LOW);
            delay(200);
        }
        delay(10000);
        medicineTaken = true; //remove later

    }
}