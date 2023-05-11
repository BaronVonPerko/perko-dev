---
date: 2018-01-25
title: Multiple CSS Transitions vs Transformations
image: css3.png
categories: Front-End Development
tags: animation,css,style,transformation,transition
---

I use transitions and transformations a lot in CSS. They are really useful tools that can help make a site look and feel really good. However, there is something I can never remember, so I am putting it in writing here for myself, and for anyone else that runs into this problem.

## Tricky Tricky

There is a very small difference in the syntax between transitioning multiple properties versus transforming multiple properties on an element. In transitions, you separate the different transitions by a comma, but transformations omit this comma.

```css
.my-class {
    transition: background-color 200ms, color 300ms, opacity 450ms;
    transform: rotateX(30deg) scale(1.1); /* no comma! */
}
```

I think this is poor design in CSS. It makes sense to separate each transition by a comma, and I would think that it would make the most sense to do the same in the transformations. I hope that if you are having an issue figuring out how to do multiple transitions or transformations that this has helped you out!