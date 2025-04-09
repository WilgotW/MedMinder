#include <Arduino.h>
#include <ESP32_Servo.h>

Servo myservo;

float rotation = 0.0;
float stepAmount = 12.27;
float maxRotation = 270.0;
float restdeg = 0.0;

void setup() {
  myservo.attach(13, 500, 2500);
  myservo.write(0);
  delay(3000);
}
 
void loop() {
  step(rotation);
}

void step(float rotation) {
  rotation += stepAmount;
  
  if(rotation >= maxRotation){
    reset(rotation);
  }else{
    int rotint = roundangle(rotation, restdeg);
    restdeg = roundrest(rotation, restdeg)
    myservo.write(rotint);
    delay(1000);
  }
}

void reset(float rotation) {
  rotation = 0;
  myservo.write(0);
  delay(1000);
}