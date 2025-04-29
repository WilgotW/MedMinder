#include "led.h"
#include <Arduino.h>

int redPin = 3;

void ledSetup(){
    pinMode(redPin, OUTPUT);
    delay(100);
    setRed();
}

void setRed(){
    digitalWrite(redPin, HIGH);
}