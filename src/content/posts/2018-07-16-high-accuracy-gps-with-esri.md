---
date: 2018-07-16
title: High Accuracy GPS with ESRI
image: esri-ipad.jpg
categories: ESRI
tags: esri,geolocation,javascript,maps,web development
---

Last week I attended the ESRI User Conference in San Diego, CA. I had a blast learning about all of their amazing geo-analytics services! We have a plan to build an app at Windstream that will require highly accurate GPS tracking on an iPad.

At the conference, I threw together a quick app that plotted where the user was each time the ESRI Track module received a GPS update. Being inside a gigantic conference center with 17,000 users caused a lot of interference, so testing at the venue was impossible. I tested a bit throughout downtown, and the accuracy was quite bad.

I did ask one of the developers that works on the GPS Track module at the conference about increasing the accuracy. He had said that the 'enableHighAccuracy' was turned on by default, and it was up to the device (more on this below).

## Testing in Decatur

After getting back to Decatur, I decided to do some more testing. I don't live near skyscrapers or large venues, so I thought maybe the GPS would be much more consistent.

![Field Testing ESRI Geolocation Services](/assets/images/esri-ipad.jpg)

As you can see, the dots tracking my location were still a bit all over the place, but it wasn't *terrible*.

We noticed when using a native app such as Google Maps, the accuracy was much better. Even after using Google Maps and switching back to our web app, the accuracy was great for a little bit, then went back to jumping all over the place.

## Progressive Web  App

I then decided to try to package up the tracker as a PWA. I had little hopes that this would affect the accuracy, but wanted to rule out every possibility. It was as I expected. The PWA did not perform any better compared to running the app within a web browser. At this point, I was thinking of making a separate native app to track the location, and built the rest of this app as the separate PWA. Not ideal, but a possible plan B.

## Faster Polling

What the developers at ESRI **did not** mention was the polling time of the default Track module. The way the GPS works on the device, is that it polls nearby cell towers and WiFi hotspots to try to triangulate your location. If you move a little, and poll again, it will get a more accurate reading.

What I found digging in the ESRI JS API docs, is that the default time for the polling is **15 SECONDS**! Even on foot, you can cover quite a bit of distance in this time.  This is what was causing the location to bounce all over the place on the map.

You can adjust the timeout of the polling in the geolocationOptions of the Track module.

```javascript
// Create an instance of the Track widget 
// and add it to the view's UI 
let track = new Track({ 
    view, 
    geolocationOptions: { 
        maximumAge: 0, 
        timeout: 500, 
        enableHighAccuracy: 
        true 
    }, 
}); 

view.ui.add(track, "top-left");
```

>DO NOT set the timeout to 0. There are a lot of Javascript examples using 0 for the timeout. Doing so will make the ESRI map not work, without even throwing console errors.

Setting the timeout to 500ms has greatly increased the GPS accuracy on my demo app. I now feel that it is just as accurate as using Google Maps with these settings.

[The demo code I used for this can be found on GitHub](https://github.com/BaronVonPerko/esri-demos/tree/master/pwa)