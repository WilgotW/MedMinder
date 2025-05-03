#include "./global/globals.h"
#include <Arduino.h>

int buttonState = 0; 

void buttonSetup(){
    pinMode(buttonPin, INPUT);
    delay(200);
}


void takeMedicine(){
    medicineTaken = true;
}
void buttonLoop(){
    buttonState = digitalRead(buttonPin);
    if(buttonState == HIGH){
        if(medicineTaken == false){
            takeMedicine();
        } 
    }
}