---
date: 2017-07-07
title: AngularJS - Unknown Provider 'eProvider' | SOLVED
image: angular-shield.png
categories: angularjs
tags: angularjs,bug,unknown provider
---

I ran into an issue the other day on our test environment at work.  It was a bug that I couldn't reproduce locally, and it drove me crazy.  Here is the link that angular was giving when the error occurred:

[https://docs.angularjs.org/error/$injector/unpr?p0=eProvider{28a1f9697f743f8d6d06f2207fadc4e6d27e2b8eeb1f2d9901b57215d544ad7a}20{28a1f9697f743f8d6d06f2207fadc4e6d27e2b8eeb1f2d9901b57215d544ad7a}3C-{28a1f9697f743f8d6d06f2207fadc4e6d27e2b8eeb1f2d9901b57215d544ad7a}20e](https://docs.angularjs.org/error/$injector/unpr?p0=eProvider{28a1f9697f743f8d6d06f2207fadc4e6d27e2b8eeb1f2d9901b57215d544ad7a}20{28a1f9697f743f8d6d06f2207fadc4e6d27e2b8eeb1f2d9901b57215d544ad7a}3C-{28a1f9697f743f8d6d06f2207fadc4e6d27e2b8eeb1f2d9901b57215d544ad7a}20e)

Here is the code in question:

```javascript
$modal.open({
    template: '<agent-chart widgets="modalCtrl.widgets" chart-title="modalCtrl.chartName"></agent-chart>',
    // ...
    resolve: {
        widgets: function() {
            return $scope.widgets;
        },
        chartName: function() {
            return chartName;
        },
    }
    // ...
})
```

Again, it works fine locally, yet angular is telling me that the **$injector** could not resolve dependencies.  The dependencies it is referring to are the *widgets* and *chartName*, which are both set up in the resolve object, and passed into the controller function.

## The Simple Fix

The solution: change the **controller** declaration to be an array, passing in the items to be injected, and having the last item be the function declaration:

```javascript
controller: ['widgets', 'chartName', function(widgets, chartName) {
    this.widgets = widgets;
    this.chartName = chartName;
}],
// ...
```

Yep, just like that.  It appears that this is only an issue in **minified** code, and works fine otherwise.  It's a silly bug, but easy to fix once you know what the issue actually is.  Happy bug hunting, friends!

