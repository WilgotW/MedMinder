#ifndef LED_H
#define LED_H

#include <Arduino.h>

void ledSetup();
void setLED(const String& color);
void startFading();
void stopFading();
void fadeLEDUpDown();

extern volatile bool keepFading;

#endif