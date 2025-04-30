#include "screen.h"
#include <Arduino.h>
#include <LiquidCrystal.h>

LiquidCrystal lcd(23, 22, 21, 18, 17, 16);

void screenSetup(){
    lcd.setCursor(8, 0);
    delay(100);
    lcd.setCursor(0, 0);
}

void screenLoop(const String& medicineTitle){
    if(medicineTitle){
        lcd.print("Ta medicin");
        delay(2000);
        lcd.print(medicineTitle);
        delay(2000);
    }
}