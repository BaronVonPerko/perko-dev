---
date: 2020-11-10
title: Fitbit Roni 1.9 Released
image: roni.png
categories: fitbit
tags: fitbit
---

## Roni Watchface 1.9 Released!

I'm proud to announce the final release of v1 of Roni has been released today 
on the Fitbit gallery.  [You can install the watch face here.](https://gallery.fitbit.com/details/19a118e0-3070-4f00-b76b-345d02853c70)
This update includes a user-requested feature, *calories*.  From within the settings, the user can now select any or all
available health metrics (steps, heart rate, calories).  I may add more in the future, after the v2 release.

![Roni metric settings](/assets/images/roni-metric-settings.jpg)

## What's in v2?

With the recent release of the Fitbit Versa 3 and Fitbit Sense devices, 
[a new SDK](https://dev.fitbit.com/blog/2020-09-24-announcing-fitbit-os-sdk-5.0) 
with loads of new features is available.  However, the older devices will not be receiving
this update.  Roni has been quite successful and I have been asked by some users to bring
it to the Versa 3 and Sense.

The new faces are built slightly differently, so the same code that is used for the existing
devices for thr Roni watch face will not work out of the box.

Luckily, I built Roni with modules of code, with separate javascript files to handle how the time
will be printed, or calculating the arc for the metric completions.  All of the logic of the 
face will be stripped out of the current project and into a reusable, local NPM package.
This package will be referenced by the current project, as well as the new one that will be built
for the new devices.

I'm looking forward to working with the new SDK and releasing v2.0 of Roni, finally making it available
to those who have purchased the Versa 3 or Sense devices.  Although v2.0 will not have any new features,
I am already making plans for the 2.1 release, which will be the first release with new features for all
devices!

Stay tuned...
