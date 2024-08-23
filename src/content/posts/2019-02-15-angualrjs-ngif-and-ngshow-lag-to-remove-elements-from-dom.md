---
date: 2019-02-15
title: AngularJS ngIf and ngShow - Lag to Remove Elements from DOM
image: angular-shield.png
categories: Angular,Front-End Development
tags: angularjs,bug
---
I've been working on an upgrade on some existing features on our app at work. I added a little animated div for each metric box while it was loading. You can see an example here:

<iframe height="300" style="width: 100%;" scrolling="no" title="Metric Loader POC" src="https://codepen.io/ChrisPerko/embed/bzMLbY?height=300&theme-id=22090&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/ChrisPerko/pen/bzMLbY'>Metric Loader POC</a> by Chris Perko
  (<a href='https://codepen.io/ChrisPerko'>@ChrisPerko</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

Once the data is loaded, this little element should disappear. However, it would lag horribly. The data would show up, and animation would remain for a second or two, and then disappear.

I tested this with both *ngIf* and *ngShow*, no change. I also wrapped the JavaScript that loads the value in a $timeout function, to make sure that the Angular digest was picking up the changes correctly.

## The Problem and Solution

So what was causing this? Was it because we were using *before* and *after* pseudo-elements on the .metric-loader* div? Or, was it the animations?

It was actually the animations. The showing and hiding within Angular works perfectly fine with pseudo-elements, but for some reason waits until the animation is at a certain point before it removes it if animating.

The solution was simple; wrap the *.metric-loader* in a div. This outer div should have the *ngIf* or *ngShow* directives. Problem solved!

```html
<div ng-show="!metrics || !metrics.length">
    <div class="metric-loader"></div>
</div>
```