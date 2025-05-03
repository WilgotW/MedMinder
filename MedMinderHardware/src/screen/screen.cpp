#include "screen.h"
#include <Arduino.h>
#include <LiquidCrystal.h>
#include "./global/globals.h"

LiquidCrystal lcd(23, 22, 21, 18, 17, 16);

void screenSetup(){
    lcd.begin(16, 2);
    screenLoop("Alvedon");
}

void screenLoop(const String& medicineTitle){
    if(medicineTitle){
        for(int i = 0; i < 5; i++){
            lcd.print("Ta medicin");
            delay(2000);
            lcd.clear();
            lcd.print(medicineTitle);
            delay(2000);
            lcd.clear();
        }
        lcd.print("Ta medicin");
    }
}