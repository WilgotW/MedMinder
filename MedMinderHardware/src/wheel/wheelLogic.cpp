#include <Arduino.h>
#include <ESP32Servo.h>
#include "./global/globals.h"
#include "./server.h"  
#include <ArduinoJson.h>

void reset();

unsigned long previousMillis = 0;
const unsigned long interval = 10000; 

void reset() {
  rotation = 0;
  servo.writeMicroseconds(minPulse);
  Serial.println("Återställer till 0°.");
  delay(10000);
}

void wheelSetup() {  
  servo.attach(servoPin, minPulse, maxPulse); 
  servo.writeMicroseconds(minPulse); 
  delay(10000);
}

void step() {
  if(rotation >= maxRotation){
    delay(1000);
    reset();
  }else{
    float startRotation = rotation;
    float targetRotation = rotation + stepAmount;

    if(targetRotation >= maxRotation){
        targetRotation = maxRotation;
    }

    //smooth rotation
    int subSteps = 100;
    float subStepAmount = (targetRotation - startRotation) / subSteps;
    
    for(int i = 0; i < subSteps; i++){
        //new rotation (in degrees)
        float rotationAmount = startRotation + (i+1)*subStepAmount;
        //calculate new pulse (int only allowed)
        int pulse = minPulse + (int)((rotationAmount / maxRotation) * (maxPulse - minPulse));
        servo.writeMicroseconds(pulse);
        
        delay(20);
    }

    rotation = targetRotation;

    delay(2000);
  }
}

