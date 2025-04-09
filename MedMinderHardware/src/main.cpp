#include <Arduino.h>
#include <ESP32_Servo.h>

Servo myservo;

void step();
void reset();

float rotation = 0.0;
float stepAmount = 12.272727272727;
float maxRotation = 180.0;   // Ändra detta till 180, 270, 360 osv beroende på vad du vill testa
int minPulse = 500;
int maxPulse = 2500;
float servoRange = 270.0;    // Servons fysiska maxvinkel enligt specifikation (justeras ej ofta)

void setup() {
  myservo.attach(13, minPulse, maxPulse);
  myservo.writeMicroseconds(minPulse); // Starta vid 0°
  delay(10000);
}

void loop() {
  step();
}

void step() {
  if (rotation >= maxRotation) {
    // Skriv ut positionen först
    int pulse = minPulse + (int)((rotation / servoRange) * (maxPulse - minPulse));
    myservo.writeMicroseconds(pulse);
    delay(1000);
    
    // Öka efter att den gått
    rotation += stepAmount;
    
    delay(1000);
    reset();
  } else {
    // Skriv ut positionen först
    int pulse = minPulse + (int)((rotation / servoRange) * (maxPulse - minPulse));
    myservo.writeMicroseconds(pulse);
    delay(1000);
    
    // Öka efter att den gått
    rotation += stepAmount;
  }
}

void reset() {
  rotation = 0;
  myservo.writeMicroseconds(minPulse); // Återställ till 0°
  delay(10000);
}