#include "led.h"
#include <Arduino.h>
#include "./global/globals.h"

void ledSetup(){
    pinMode(ledPin, OUTPUT);
    delay(100);
}

void ledTurnOn(){
    digitalWrite(ledPin, HIGH);
}
void ledTurnOff(){
    digitalWrite(ledPin, HIGH);
}