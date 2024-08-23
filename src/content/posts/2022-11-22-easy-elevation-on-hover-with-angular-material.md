---
date: 2022-11-22
title: Easy Elevation Change on Hover with Angular Material
image: angular-material-elevation-on-hover.png
categories: angular
tags: angular,material
---

I recently did a bit of a redesign on the 
[Angular Community Meetup website](https://angularcommunity.net), and wanted
to add a little hover effect on the new profile cards that I built.  If we
were just using custom CSS, a simple `:hover` in the CSS file would suffice.

However, we are using [Angular Material](https://material.angular.io/).  The 
Angular Material library comes with some helpful CSS classes for what I wanted to 
achieve.  These classes are what are referred to as _elevation_.  

In the case of this project, I wanted to change the elevation from a level 2
(`.mat-elevation-z2`) to a level 8 (`.mat-elevation-z8`) when the user hovers
over the profile card.  This would give the illusion of the card coming up off
of the screen a bit, by increasing the size of the shadow and changing the opacity.
I'm not a shadow expert, so I let the library handle that for me.

## Changing the Elevation Class in Angular on Hover

I started thinking about how I would implement this.  As I stated before, I would
normally reach for `:hover`, but the class is applied in the HTML and not a custom
CSS rule.

```html
<div class="mat-elevation-z2">
  ...
</div>
```

I then started thinking about adding a property `isHovered` to the component, and then 
using `(onmouseenter)` and `(onmouseleave)` to handle updating this `isHovered` 
property.  I would then need to use `ngClass` to set the correct elevation level.

This seemed a bit much to handle this little hover effect.

## Angular Material Helpers

Luckily, the smart people at Google have already thought about this and have created
a solution for us.  Angular Material has a 
[elevation helper](https://material.angular.io/guide/elevation) guide to help with 
these elevation changes.

We can simply give our profile cards a class and handle the change in CSS like we
originally planned on.

```html
<div class="profile-card">
  ...
</div>
```

```css
.profile-card {
    @include mat.elevation-transition();
    @include mat.elevation(2);
    
    &:hover {
      @include mat.elevation(8);
    }
}
```

I highly recommend reading the guide, but the above example handles everything that
we need to get this effect working.  They even include a handy helper function
to include the transitions for the elevation change, so you don't even have to write
that in CSS!
