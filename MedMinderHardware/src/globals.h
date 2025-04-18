#ifndef GLOBALS_H
#define GLOBALS_H

#include <ESP32_Servo.h>

// wheel variables
extern Servo servo;

extern float rotation;
extern float stepAmount;

extern float maxRotation;
extern float servoRange;

extern int minPulse;
extern int maxPulse;

#endif