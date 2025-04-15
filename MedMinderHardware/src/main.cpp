// #include <Arduino.h>
// #include "globals.h"
// #include "wheelLogic.h"
// #include "server.h"

// void setup() {
//   Serial.begin(115200);
//   Serial.println("Hello!");

//   serverSetup(); 

//   servo.attach(13, minPulse, maxPulse);
//   servo.writeMicroseconds(minPulse);
//   delay(10000);
// }

// unsigned long previousMillis = 0;
// const unsigned long interval = 10000; 

// void loop() {
//   unsigned long currentMillis = millis();
//   if (currentMillis - previousMillis >= interval) {
//     previousMillis = currentMillis;
//     getDose();  
    
//   }

// }


#include <Arduino.h>
#include <LiquidCrystal.h>

LiquidCrystal lcd(23, 22, 21, 18, 17, 16);
int audioSource = 25;


void setup() {
  lcd.setCursor(8, 0);
  delay(100);
  lcd.setCursor(0, 0);
  lcd.print("Ta medicin");
  pinMode(audioSource, OUTPUT);
}

void loop() {
  delay(1000);
  digitalWrite(audioSource, HIGH);
  delay(2000);
  digitalWrite(audioSource, LOW);
  delay(2000);
}

