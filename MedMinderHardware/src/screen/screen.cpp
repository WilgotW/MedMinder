#include "screen.h"
#include <Arduino.h>
#include <LiquidCrystal.h>
#include "./global/globals.h"

LiquidCrystal lcd(D5, D4, D3, D2, D1, D0);

unsigned long lastScreenUpdate = 0;
int screenStage = 0;
int screenCycle = 0;
bool screenActive = false;
String currentMedicine = "";
String nextDoseTime = "";

void screenSetup() {
    lcd.begin(16, 2);
}

void screenLoop(const String& medicineTitle) {
    currentMedicine = medicineTitle;
    screenActive = true;
    screenCycle = 0;
    screenStage = 0;
    lastScreenUpdate = millis();
}
void updateScreen() {
    unsigned long now = millis();

    if(!medicineTaken){
        if (screenActive) {
            if (now - lastScreenUpdate >= 2000) {
                lcd.clear();
                lcd.setCursor(0, 0);
                if (screenStage % 2 == 0) {
                    lcd.print("Ta medicin");
                } else {
                    lcd.print(currentMedicine);
                }
    
                screenStage++;
                lastScreenUpdate = now;
    
                if (screenStage >= 10) {
                    screenActive = false;
                }
            }
            return;
        }
    }else{
        if (now - lastScreenUpdate >= 5000) {
            if(nextDoseTime != ""){
                lcd.clear();
                lcd.setCursor(0, 0);
                lcd.print("Next dose:");
                lcd.setCursor(0, 1);
                lcd.print(nextDoseTime);
                lastScreenUpdate = now;
            }else{
                lcd.clear();
                lcd.setCursor(0, 0);
                lcd.print("Ingen medicin");
                lcd.setCursor(0, 1);
                lcd.print("Att ta idag...");
                lastScreenUpdate = now;
            }
        }
    }
}