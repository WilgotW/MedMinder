#include "globals.h"

//pins
int audioSource = 25;
int greenLED = 35;
int redLED = 34;
int whiteLED = 33;
int servoPin = 13;

Servo servo;

float rotation = 0.0;
float stepAmount = 12.3;

float maxRotation = 270.0;
float servoRange = 270.0;

int minPulse = 500;
int maxPulse = 2500;

