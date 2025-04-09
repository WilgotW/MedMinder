#include <Arduino.h>
#include <ESP32_Servo.h>

// Lägg till prototyper för roundangle och roundrest innan de anropas
static int roundangle(float angle, float rest);
static float roundrest(float angle, float rest);

Servo myservo;

float rotation = 0.0;
float stepAmount = 12.27;
float maxRotation = 270.0;
float restdeg = 0.0;

void step();
void reset();

void setup() {
  myservo.attach(13, 500, 2500);
  myservo.write(0);
  delay(3000);
}

void loop() {
  step();  // Anropa utan argument
}

void step() {
  rotation += stepAmount;

  if (rotation >= maxRotation) {
    reset();
  } else {
    int rotint = roundangle(rotation, restdeg);
    restdeg = roundrest(rotation, restdeg);
    myservo.write(rotint);
    delay(1000);
  }
}

void reset() {
  rotation = 0;
  restdeg = 0;
  myservo.write(0);
  delay(1000);
}

// Returnerar heltalsdelen av angle + rest
static int roundangle(float angle, float rest) {
  float wangle = angle + rest;
  int wholeangle = wangle;
  return wholeangle;
}

// Returnerar decimaldelen av angle + rest
static float roundrest(float angle, float rest) {
  float a = angle + rest;
  int b = a;
  return a - b;
}