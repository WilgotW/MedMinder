#include "led.h"
#include <Arduino.h>
#include "./global/globals.h"

void ledSetup(){
    pinMode(ledPin, OUTPUT);
}

void ledTurnOn(){
    digitalWrite(ledPin, HIGH);
    delay(100);
}
void ledTurnOff(){
    digitalWrite(ledPin, HIGH);
}