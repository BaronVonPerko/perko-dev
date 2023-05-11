---
date: 2018-03-22
title: "Choosing a Starter Theme: _Underscores vs Sage vs AWPS"
image: wordpress-development.jpeg
categories: WordPress
tags: css,design,theme,web development,wordpress
---

I have been planning a custom theme for my personal site here at [ChrisPerko.NET](https://chrisperko.net). Currently, the site is running a child theme of Hestia, developed by [ThemeIsle.com](https://themeisle.com/). It's a great theme, and I've had it for over a year, but I want something custom! I had a choice to make; which starter theme to use? It is very useful to create a theme completely from scratch in order to understand what all is being done behind the scenes. Alecaddd has a great YouTube series called [Create a Premium WordPress Theme](https://www.youtube.com/playlist?list=PLriKzYyLb28kpEnFFi9_vJWPf5-_7d3rX), and it is a great place to start if you've never built a theme from scratch.

## _Underscores

![Underscores Logo](/assets/images/underscores.png)

[_Underscores](https://underscores.me/) is a great starter theme. It was created by the same folks that created and maintain WordPress itself. I am currently using this as part of the [TailwindCSS Theming Series](https://www.youtube.com/playlist?list=PLht-7jHewMA4KfgZGHNyEx3mD-OJjaasM) on YouTube. _Underscores gets rid of all the annoying parts of developing a theme, such as setting up the header.php and footer.php files, javascript and stylesheet enqueues, and even setting up a simple mobile navigation menu! If you are fairly new to WordPress theme development, it is a great place to start. Honestly, a simple theme could be built by just working the CSS of the _Underscores theme.

[The WordPress CLI](https://wp-cli.org/) (Command Line Interface) comes baked with a command to generate a brand new _Underscores theme for you in an existing WordPress installation. This feature allows a rapid setup of your environment; in minutes you can have a fresh install of WordPress running locally, with a brand new theme ready for styling!

## Sage

![Sage Logo](/assets/images/sage.png)

I have been working in Laravel development for that past year, and really love the framework. One thing I really like about it, is how fast you can get an application running using Blade templates. If you don't know, [Blade](https://laravel.com/docs/5.6/blade) allows you to write very clean front-end code with access to all the PHP goodness. Instead of having to break into PHP to do something such as a for loop, you can simply do this in Blade: **@foreach(users as user):**.

Using Blade templates in WordPress seemed like it would be a great way to write cleaner, more readable code. This is where [Sage by Roots](https://roots.io/sage/) comes in. Sage is a starter theme that comes with a bunch of goodies out of the box just like _Underscores. It has all of the fun things that Blade has to offer, such as extending layout files, and you can start it by using Bootstrap 4, Foundation, Bulma, or even nothing if you really want to control everything.

My main concern with Sage is how drastically different it is to a regular theme. The file structure closely resembles an application source structure than a theme. This may work for you if you are building a complicated application on top of WordPress, but for a standard theme this will seem very daunting. The Blade files are nice and neat, but you must have a separate file acting like a controller to get the data you need to that Blade template. Controllers make a lot of sense when building an app, but to just display a post on a page seems like overkill to me.

My last gripe with Sage really just comes down to this: What if I build a theme for a client and later on they decide to hire another developer to make some changes? That developer will most likely have never used Sage, and the huge difference in file structure alone versus a standard theme will probably completely confuse that developer. Using Sage would also be a huge learning curve for an inexperienced developer, so if you are new to the world of web development, I highly suggest using either of the other two starter themes on this post.

## AWPS

![AWPS Logo](/assets/images/awps.png)

The last starter theme for this post is [AWPS](https://github.com/alecaddd/awps), or the Alecaddd WordPress Starter Theme. AWPS is based on _Underscores, so if you like what _Underscores has to offer, I highly recommend at least taking a look at this theme.

This theme has an advantage in my book over _Underscores in that the back-end is all object-oriented. This leads to much cleaner code, and is very easy to extend to add in any feature you can think of. It utilizes the PSR-4 autoloader, so no more require() lines scattered about in your PHP code.

Want a fast setup? No worries, there is a [CLI](https://github.com/Alecaddd/awps-cli) for that! A new feature of the CLI allows you to even give the theme a custom namespace for all of the class files. Want a more in-depth look at it in a video format? Alessandro has even created a [YouTube series on AWPS](https://www.youtube.com/watch?v=NKRheNMczlM) to get you familiar with it quickly.

## Conclusion

In conclusion, for my new theme, I have decided to go with AWPS. Although it doesn't use Blade templates, which I originally wanted, it is very easy to use. Packed with all the features I loved about _Underscores, AWPS really brings the starter theme up to modern day coding standards.

For beginner developers, I recommend either starting with _Underscores, or if you have an understanding of OOP, go with AWPS. You will be up and running in no time!