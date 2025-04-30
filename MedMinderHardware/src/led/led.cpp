#include "led.h"
#include <Arduino.h>

int greenLED = 35;
int redLED = 34;
int whiteLED = 33;

void ledSetup(){
    pinMode(greenLED, OUTPUT);
    pinMode(redLED, OUTPUT);
    pinMode(whiteLED, OUTPUT);

    delay(100);
}

void setLED(const String& color){
    if(color == "g"){
        digitalWrite(greenLED, HIGH);
        digitalWrite(redLED, LOW);
        digitalWrite(whiteLED, LOW);
    }else if(color == "r"){
        digitalWrite(redLED, HIGH);
        digitalWrite(greenLED, LOW);
        digitalWrite(whiteLED, LOW);
    }else if(color == "w"){
        digitalWrite(whiteLED, HIGH);
        digitalWrite(redLED, LOW);
        digitalWrite(greenLED, LOW);
    }
}

