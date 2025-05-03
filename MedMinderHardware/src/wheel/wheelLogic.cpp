#include <Arduino.h>
#include "./global/globals.h"
#include "./server.h"  
#include <ArduinoJson.h>
#include <ESP32_Servo.h>

void reset();

unsigned long previousMillis = 0;
const unsigned long interval = 10000; 

void reset() {
  rotation = 0;
  servo.writeMicroseconds(minPulse);
  Serial.println("Återställer till 0°.");
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

void wheelSetup() {
  Serial.begin(115200);
  delay(1000); 

  Serial.println("Starting wheelSetup...");

  if (servo.attach(servoPin, minPulse, maxPulse)) {
    Serial.println("Servo attached successfully.");
  } else {
    Serial.println("Failed to attach servo.");
  }

  // 2) Home the servo
  rotation = 0;
  servo.writeMicroseconds(minPulse);
  Serial.print("Writing min pulse: ");
  Serial.println(minPulse);
  delay(2000);

  // 3) Rotate to maxPulse to test movement
  servo.writeMicroseconds(maxPulse);
  Serial.print("Writing max pulse: ");
  Serial.println(maxPulse);
  delay(2000);

  // 4) Back to middle
  int middlePulse = (minPulse + maxPulse) / 2;
  servo.writeMicroseconds(middlePulse);
  Serial.print("Writing middle pulse: ");
  Serial.println(middlePulse);
  delay(2000);

  Serial.println("wheelSetup test completed.");
}