# ProDVX API
API that allows control of ProDVX panels with built-in LED lights.  
To install, open a browser on the ProDVX panel and go to: [tiny.cc/prodvxapi](https://avdistributors.github.io/prodvx-api/)
---
## Usage
Commands should be sent over a raw/telnet type data connection, on **port 5000**.
All commands need to be terminated with an end-of-line character, which can be either **\r** OR **\n**.  
Responses sent back from the panel will always end in **\n**  

## SLB
### SET Syntax:
> set TARGET L,R,G,B\n

Where:
> **TARGET** = "all", or number from 1 -> 52  
> **L** = LED brightness, 0 -> 15  
> **R** = Red value, 0 -> 100  
> **G** = Green value, 0 -> 100  
> **B** = Blue value, 0 -> 100  
> LED 1 located at top center of panel, moving clockwise as numbers increase.  
**NOTE:** LED brightness is not calibrated, and as such setting all colours to max value will *not* give a true white. Experimentation is needed to find the desired colour.  
  
Examples (Response in bold):
> set all 15,100,100,100\n  <-- Set all LEDs to brightest value  
> **OK\n**  
> set 12 5,0,20,0\n         <-- Set 12th LED to a dull green  
> **OK\n**  
> set 45 10,0,0,50\n        <-- Set 45th LED to medium blue  
> **OK\n**  
  
### GET Syntax:
> get TARGET\n

Where:
> **TARGET** = "all", or number from 1 -> 52  
Response will be a stringified JSON object, which should be parsed.  
  
Examples (Response in bold):
> get all\n  <-- Get state of all LEDs  
> **\[\{"l":8,"r":0,"g":100,"b":0\},\{"l":8,"r":0,"g":100,"b":0\}, ... \{"l":8,"r":0,"g":100,"b":0\}\]\n**  
> get 30\n   <-- Get state of only the 30th LED  
> **\{"l":15,"r":100,"g":0,"b":0\}\n**  
  
  
## DSKPL/DSQPL
### SET Syntax:
> set TARGET VAL\n

Where:
> **TARGET** = "red" or "green"  
> **VAL** = "0" or "1"  
  
Examples (Response in bold):
> set red 1\n     <-- Set red LED to ON  
> **OK\n**  
> set green 0\n   <-- Set green LED to OFF  
> **OK\n**  
  
### GET Syntax:
> get TARGET\n

Where:
> **TARGET** = "red" or "green"
  
Examples (Response in bold):
> get red\n    <-- Get state of red LED  
> **1\n**  
> get green\n  <-- Get state of green LED  
> **0\n**  