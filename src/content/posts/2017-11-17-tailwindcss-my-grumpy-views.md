---
date: 2017-11-17
title: "TailwindCSS - My Grumpy Views"
image: tailwind-twitter-card.jpg
categories: Front-End Development
tags: css,review,tailwind
---
A few months ago, I remember [Adam Wathan](https://twitter.com/adamwathan) tweeting about a CSS framework he was building, titled [Tailwind](https://tailwindcss.com) (it came from building his KiteTail app).  I turned thirty this year, and that seems to have made me a grumpy old developer.  I used to see something new and want to be the first one using it, on the bleeding edge of technology.  Five years ago I would have been so excited to see this.  Why was I grumpy?  Utility-first CSS was why!

Utility-first CSS seemed to me like nothing better than writing inline styles.  We, as an industry, moved away from writing inline styles and started using style-sheets for many reasons.  Separations of concerns was one, and also the ability to refactor your code.  I saw some examples of Tailwind online, and was disgusted to see code like this:

```html
<img class="w-24 rounded rounded-full border-4 border-white absolute pin-l pin-b -mb-8 ml-4" src="..." />
```

Can you imagine if you wanted to have a bunch of images look the same, re-using the same massive group of classes?  Think of what would happen if management or your client came to you and said "Hey, let's make all the images not have that white border".  Now you will have to search through your files and find all of those classes scattered among your HTML (or JavaScript if you are using templates in a framework such as React, Vue, etc).

## The Good Parts

Tailwind does allow you to make extremely quick mock-ups and proof of concepts.  I finally gave in to my grumpiness and read through the docs, and started playing with the code on [CodePen](https://codepen.io/ChrisPerko/).  The first thing I did was a recreation of a Twitter profile card, which actually landed on the front-page of Codepen.  [You can view the pen and the source code here](https://codepen.io/ChrisPerko/pen/XzMRQJ?editors=1000).

![A twitter card I built with Tailwind](/assets/images/tailwind-twitter-card.jpg)

I also started playing with making my own set of alert boxes.  First, I started by recreating a couple of the examples from the Tailwind docs, then made some modifications to design my own.  [(Again, you can view the code on Codepen](https://codepen.io/ChrisPerko/pen/YEVvWz).

![Alert boxes built with Tailwind](/assets/images/tailwind-alert-boxes.png)

## I'm Not So Grumpy Anymore

The ability to make these components is super simple with Tailwind.  But what about a real application?  I'm not talking about a TODO app or something you just bang out one afternoon; I'm talking a large application.  How do we manage all of these classes, and how do we manage large design changes on a project?  Here is the answer that changed my opinion of Tailwind: it is [component-friendly](https://tailwindcss.com/docs/what-is-tailwind/#component-friendly)!  This means that you can actually take those globs of classes that you want to use for every image, or button, or notification box, and create a component out of them.  This single feature is what really made me see the light.  You still get the ability to make awesome design components extremely quickly, and you can put those ideas to use into components that you can use throughout your project!

I am too far into KickoffWP.com to be willing to refactor everything to use Tailwind, but I do plan to utilize the framework in my next project.