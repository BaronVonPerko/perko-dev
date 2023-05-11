---
date: 2018-08-24
title: "FitBit CLI Error: Device Only Supports Higgs Applications"
image: fitbit-roni.jpg
categories: FitBit Development
tags: bug,fitbit,web development
---

## New CLI For FitBit!

Yesterday, FitBit released a [brand new CLI](https://dev.fitbit.com/blog/2018-08-23-cli-tools/) for developers. This is huge news that brings development to the local machine, and doesn't rely on the use of their web-based studio.

Don't get me wrong, the studio is a great tool! However, it is very nice to be able to run local editors such as VSCode.

When I was testing the new CLI, I ran into an issue that is simple to solve, but I couldn't find anything online telling me what was wrong. Here is the error when trying to install my app to the simulator:

```bash
Install failed: App was built for meson, but connected device only supports higgs applications.
```

## The Solution

Silly me... My app is only built to work on Versa devices. The simulator first launched as an Ionic device. So naturally, the app will not install to Ionic. You can change this from within your **package.json** file.

``` json
"buildTargets": [
    "meson",
    "higgs"
],
```

**meson** is for the Versa, and **higgs** is for Ionic. If you weren't aware of this before, then the error wouldn't mean anything to you. But, now you know, so go out there and make some amazing apps for FitBit!

