---
date: 2017-09-01
title: "Initializing AngularJS Controllers - NgIf vs NgShow"
image: switch.jpg
categories: Angular
tags: angularjs,bug,controller,ngif,ngshow
---
This week I ran into an issue regarding a plugin we use at work called DataTables.  This plugin starts throwing errors when it is initialized more than once, and I could not figure out how this was happening.  It was random, and hard to reproduce.  I think I have the solution...

The DataTables are inside of a div that has an ngIf directive on it.  I figured that it would initialize the controller once the ngIf was true, and not re-initialize it, but I was wrong.

I created an example on [CodePen](https://codepen.io/ChrisPerko/pen/XaoyEQ) to demonstrate the difference of how a controller is instantiated in both ngIf and ngShow.  There are two divs that contain a controller and an ngInit function.  The ngInit is called when the controller starts up and sends a message to the controller that is then displayed in an alert box.  Not the fanciest thing, but it gets us the information we need.

Interestingly, even though the first div (with ngShow) is hidden, it alerts immediately.  Toggling the button to show and hide it does not cause it to alert again.  However, the second div (with ngIf) does not alert until the toggle is clicked, and then again each time it is re-added to the DOM.