#include <Arduino.h>
#include "globals.h"

void step();
void reset();

void step(){
    if(rotation >= maxRotation){
      delay(1000);
      reset();
    }else{
      //take step
      float startRotation = rotation;
      float targetRotation = rotation + stepAmount;
  
      if(targetRotation >= maxRotation){
        targetRotation = maxRotation;
      }
  
      //smooth rotation
      //calculate substeps
      int subSteps = 100;
      float subStepAmount = (targetRotation - startRotation) / subSteps;
      
      for(int i = 0; i < subSteps; i++){
        //new rotation (in degrees)
        float rotationAmount = startRotation + (i+1)*subStepAmount;
        //calculate new pulse (int only allowed)
        int pulse = minPulse + (int)((rotationAmount / maxRotation) * (maxPulse - minPulse));
        servo.writeMicroseconds(pulse);
        
        //print rotation
        Serial.print("Rotation: ");
        Serial.print(rotationAmount, 6);
        Serial.println("°");
        
        delay(20);
      }
  
      rotation = targetRotation;
  
      delay(2000);
    }
  }
  
  void reset() {
    rotation = 0;
    servo.writeMicroseconds(minPulse);
    Serial.println("Återställer till 0°.");
    delay(10000);
  }