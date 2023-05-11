---
date: 2022-11-04
title: No Value Accessor Error With Angular Material
image: angular-shield.png
categories: angular
tags: angular,bug,fix
---

Ahh, a dreaded error in Angular that you've probably seen many times before...

`Error: No value accessor for form control with unspecified name attribute`

It's not very informative, and the fix may not be what you're expecting.  Many times, 
it can be that the `[formControlName]` or `[formControl]` is not on the `input` element, 
but instead on a `label` or `div` that is wrapping the form control.

However, one case that always gets me is in running unit tests, particularly when
using [Angular Material](https://material.angular.io/).  This short post will show
you an example of something to check for that very well may solve your issue.

## Fix for Angular Material

When using Angular Material, we often use many different form control elements.  Usually,
it is a simple `input`, but other times we may be using something like a `select` instead.
The error above can be seen in tests even if you have the `[formControlName]` or 
`[formControl]` on the correct element, but if you forgot to import the correct module
for that element.

For example, if you are using a `mat-select`, you will need to make sure that the 
`MatSelectModule` is listed in your **imports** section when creating the test bed.

This simple fix will solve the obscure and uninformative error that you get when
running your tests!

Happy bug hunting! 🪲
