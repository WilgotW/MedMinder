#ifndef GLOBALS_H
#define GLOBALS_H

#include <Servo.h>
// wheel variables
extern Servo servo;

extern float rotation;
extern float stepAmount;

extern float maxRotation;
extern float servoRange;

extern int minPulse;
extern int maxPulse;

extern int audioSource;
extern int ledPin;
extern int servoPin;
extern int buttonPin;
extern bool medicineTaken;


#endif