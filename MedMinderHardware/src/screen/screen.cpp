// #include "screen.h"
// #include <Arduino.h>
// #include <LiquidCrystal.h>
// #include "./global/globals.h"

// LiquidCrystal lcd(D5, D4, D3, D2, D1, D0);

// void screenSetup(){
//     lcd.begin(16, 2);
//     screenLoop("Alvedon");
// }

// void screenLoop(const String& medicineTitle){
//     if(medicineTitle){
//         for(int i = 0; i < 5; i++){
//             lcd.print("Ta medicin");
//             delay(2000);
//             lcd.clear();
//             lcd.print(medicineTitle);
//             delay(2000);
//             lcd.clear();
//         }
//         lcd.print("Ta medicin");
//     }
// }


// screen.cpp
#include "screen.h"
#include <Arduino.h>
#include <LiquidCrystal.h>
#include "./global/globals.h"

LiquidCrystal lcd(D5, D4, D3, D2, D1, D0);

// Internal state variables
unsigned long lastScreenUpdate = 0;
int screenStage = 0;
int screenCycle = 0;
bool screenActive = false;
String currentMedicine = "";

void screenSetup() {
    lcd.begin(16, 2);
    delay(500);
    
}

// Call this once to start the display loop
void screenLoop(const String& medicineTitle) {
    currentMedicine = medicineTitle;
    screenActive = true;
    screenCycle = 0;
    screenStage = 0;
    lastScreenUpdate = millis();
}

// Call this from loop() continuously
void updateScreen() {
    if (!screenActive) return;

    unsigned long now = millis();
    if (now - lastScreenUpdate >= 2000) {
        lcd.clear();
        if (screenStage % 2 == 0) {
            lcd.print("Ta medicin");
        } else {
            lcd.print(currentMedicine);
        }

        screenStage++;
        lastScreenUpdate = now;

        if (screenStage >= 10) {  // 5 full cycles
            screenActive = false;
        }
    }
}