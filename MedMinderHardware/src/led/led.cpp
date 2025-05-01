#include "led.h"
#include <Arduino.h>
#include "./global/globals.h"


int pwmChannelWhite = 15;
int pwmResolution = 8;  
int pwmFrequency = 5000; 

volatile bool keepFading = true;

void ledSetup(){
    pinMode(greenLED, OUTPUT);
    pinMode(redLED, OUTPUT);
    pinMode(whiteLED, OUTPUT);

    ledcSetup(pwmChannelWhite, pwmFrequency, pwmResolution); 
    ledcAttachPin(whiteLED, pwmChannelWhite);

    delay(100);

    setLED("g");
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

void fadeLEDUpDown() {
    int duration = 2000;

    

    // for (int i = 0; i <= 255; i++) {
    //     ledcWrite(pwmChannelWhite, i); 
    //     delay(duration / 255);  
    //     if (!keepFading) return; 
    // }

    // for (int i = 255; i >= 0; i--) {
    //     ledcWrite(pwmChannelWhite, i);
    //     delay(duration / 255);  
    //     if (!keepFading) return; 
    // }
}

void stopFading() {
    keepFading = false;
}

void startFading(){
    keepFading = true;
}