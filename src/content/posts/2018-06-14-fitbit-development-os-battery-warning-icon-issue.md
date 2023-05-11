---
date: 2018-06-14
title: FitBit Development - OS Battery Warning Icon Issue
image: fitbit-roni-purple.jpg
categories: FitBit Development
tags: bug,css,fitbit,javascript
---

When developing my first FitBit Versa watch face, I ran into an issue when my wife and I were testing on our devices.  When the battery gets low, the OS displays a low battery icon.  The issue here is that the face that I developed already has an icon that changes with the battery level:

![The FitBit Roni Watchface](/assets/images/fitbit-roni.jpg)

Now the OS battery icon is in almost the same exact place, so it looks really weird to have them overlapping each other.  From what I have found on the developer's forum, there is no way to suppress the OS's icon.

## Solution

According to the Versa user manual, the OS displays the icon when the device is within 24 hours of running out of power, and starts flashing when it gets to a critical level.  The only solution that I have come up with at this time is to just hide my custom icon when it gets near that level. Hopefully in the future, the power API will be able to tell us when this actually happens, as it can be different for different devices. Here is a simplified version of the JavaScript that handles this for us:

```javascript
import { battery } from "power";
 
imgBattery = document.getElementById("battery_img");
 
let batteryChargeLevel = Math.floor(battery.chargeLevel);
 
if(batteryChargeLevel <= 20) {
    imgBattery.style.display = "none";
} else {
    imgBattery.style.display = "inline";
}
```

For the full code, you can visit the repository for this face on [GitHub](https://github.com/BaronVonPerko/fitbit-roni/blob/master/app/inc/battery.js). This file also contains an example of how to hide the custom icon when the watch is attached to the charger, as again, the OS has it's own icon that it wants to display.

I am hopeful that in a future version of the FitBit OS, we will have the ability to suppress the OS's icon, and be able to just use our custom icon for our watch face.