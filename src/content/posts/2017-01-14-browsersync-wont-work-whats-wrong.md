---
date: 2017-01-14
title: "BrowserSync Won't Work!  What's Wrong?"
image: struggling-to-code.jpg
categories: Front-End Development
tags: browsersync,gulp,help
---

## What is BrowserSync Anyway?

If you found this page from searching Google, you probably are already aware of what it is.  If not, BrowserSync allows the developer to instantly see changes in the browser when developing a site or app.  It is extremely useful and has been a nice productivity booster for my own development work.  [Click here to learn more](https://browsersync.io/).

## The Problem

Part of my workflow when developing sites and apps is to use BrowserSync.  BrowserSync allows me to code away, and update the browser without me having to change my focus and refresh the page.  Stylesheet changes are injected automagically, and changes to javascript or html files refresh right away.

When I first started using BrowserSync with Gulp, I ran into an issue that took me way too long to fix.  I figured I would write this small post in case any of you out there have run into this problem as well.

Here is the Gulp task:

```javascript
gulp.task('browser-sync', ['sass'], function() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notify: false
    });

    gulp.watch('app/sass/**', ['sass']);
    gulp.watch('app/**/*.js', ['js']);
    gulp.watch('app/**/*.js').on('change', browserSync.reload);

    gulp.watch('app/**/*.html').on('change', browserSync.reload);
    gulp.watch('app/components/**/*.html').on('change', browserSync.reload);
    gulp.watch('app/*').on('change', browserSync.reload);
});
```

I spent a long time staring at this code trying to figure out WHY nothing was happening when I changed a file.  The task was running, and there were no errors....

## Solution #1

The answer was simple!  I forgot to add the browsersync.js file into my html:

```html
<!-- browser-sync for dev -->
<script type="text/javascript" src="libs/browser-sync.js"></script>
```

So, next time you start a new project and your automated syncing is just not working, remember to check and see if you included the javascript file needed for the sync to work.

## Solution #2
Still not working?  Browsersync also has a little trick up it's sleeve.  It will inject some other scripts into the page that it needs to do its magic.  The following shows the scripts that are in the html when running in the browser:

![Browsersync loading scripts](/assets/images/browsersync.png)

In order for this to happen, your code needs a <body> tag.  This has happened to me before when first setting up a gulpfile.js for a new project and not actually fleshing out your typical html, head and body.

I hope this has helped someone out there.  Leave a comment below if you've had any other issues related to this that should be added to this post!