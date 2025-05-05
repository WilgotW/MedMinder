#ifndef SCREEN_H
#define SCREEN_H

#include <Arduino.h>

void screenSetup();
void screenLoop(const String& medicineTitle);
void updateScreen();

#endif