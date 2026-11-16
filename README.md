# MECIT - ARMorix
A prototype initially developed during Tech For Good (T4G) 2022, organised by Engineering Good and co-produced by the Singapore Institute of Technology (SIT), under the problem statement of "Independent Creative Photography".<br /><br />
It consists of a robotic arm with an attached mobile phone running a camera application that is controlled fully via eye tracking. The camera application is also able to wirelessly control the movement of the robotic arm by automatically positioning it based on face tracking.<br /><br />
_This repository reflects the initial ARMorix prototype as of Apr 2023. A second prototype was subsequently developed as of Jan 2024 featuring an improved architecture and fixes for shortcomings in this version, though its source code has unfortunately been lost and can no longer be made publicly available._

## Table of Contents
* [Original Members](#original-members)
* [Tools and Technologies](#tools-and-technologies)
* [Camera Components](#camera-components)
* [Robotic Arm](#robotic-arm)
* [Bluetooth](#bluetooth)

## Original Members
MECIT consists of alumni from SIT:<br />
| Name                | Course   | Period               |
| :---:               | :---:    | :---:                |
| Alencia Tan         | MDME     | May 2022 to Jan 2024 |
| Yu Yucan            | ICT(SE)  | May 2022 to Jan 2024 |
| Aliimul Hakiim      | ICT(IS)  | May 2022 to Jan 2024 |
| Yeo Yi Xuan         | ICT(IS)  | May 2022 to Apr 2023 |
| Lai Wen Jun         | ICT(SE)  | Apr 2023 to Jan 2024 |
| Wang Ting Wei       | ICT(SE)  | Apr 2023 to Jan 2024 |

## Tools and Technologies
* Expo
* Arduino Uno
* MG995 Servo Motor
* HC-05 Bluetooth Module

## Camera Components
* Bluetooth: Handles all Bluetooth-related operations.
* Camera: Mobile application with face tracking features.
* Navigation: Stores user navigation options.

## Robotic Arm
Arduino code can be located in the mecit-arm directory.

## Bluetooth
Instructions are sent from our mobile application (CHAR) to the Arduino Uno (UINT) via Bluetooth Classic.
| CHAR  | UINT  | INSTRUCTION    |
| :---: | :---: | :---:          |
| NULL  | 0     | NIL            |
| a     | 97    | LANDSCAPE MODE |
| b     | 98    | PORTRAIT MODE  |
| c     | 99    | MOVE DOWN      |
| d     | 100   | MOVE UP        |
| e     | 101   | MOVE LEFT      |
| f     | 102   | MOVE RIGHT     |
