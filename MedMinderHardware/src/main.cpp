#include <Arduino.h>
#include <ESP32_Servo.h>  // Kontrollera att detta är rätt headerfil för ditt bibliotek

Servo myservo;

void setup() {
  // Anslut servon till GPIO 13 med angivna pulsbreddsgränser (justera vid behov)
  myservo.attach(13, 500, 2500);
  
  // Starta på 0° och vänta 3 sekunder
  myservo.write(0);
  delay(3000);
}

void loop() {
  // Svep gradvis från 0° upp till 30°
  for (int pos = 0; pos <= 250; pos++) {
    myservo.write(pos);
    delay(50);   // Justera delay för att anpassa hastigheten
  }
  // Pausa 3 sekunder vid 30°
  delay(3000);
  
  // Svep tillbaka gradvis från 30° till 0°
  for (int pos = 250; pos >= 0; pos--) {
    myservo.write(pos);
    delay(50);
  }
  // Pausa 3 sekunder vid 0°
  delay(3000);
}