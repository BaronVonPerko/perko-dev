---
date: 2023-06-30
title: "The Overlooked Rule that Breaks Angular 16’s Signal Effects"
image: angular-16-signals.webp
categories: angular
tags: angular,signals
---
> This post was also published to the official
> [HeroDevs blog on medium](https://medium.com/herodevs/the-overlooked-rule-that-breaks-angular-16s-signal-effects-876ce6930737).

With Angular 16, we now have access to [Signals](https://angular.io/guide/signals#angular-signals), 
Angular’s new way to handle fine-grained change detection. With it comes `effects`, which gives us a way 
to handle side-effects when [one or more signals are updated](https://angular.io/guide/signals#effects).

However, there is a simple rule that many developers are not aware of, and this can easily lead them 
into writing code that will simply not **always** run. It can be frustrating to try and debug code that _sometimes_ 
works, so use this guide to help you navigate the new world of signals and effects in Angular.

## Writing Effective Effects in Angular 16

We can add an `effect` to our code quite easily. Here is an example provided by the Angular docs, which will 
print the current count each time the count signal is updated:

```ts
effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

But how does Angular know when to trigger this effect? The effect will automatically be triggered when the component is loaded. 
Once it has run, Angular will track any signals that are **read**, and will fire again when those signals are changed.

Each time the effect is run, it will do this again, watching any signals that are read on the _most recent execution_.

This is a key rule to keep in mind. Because of this, if you have a signal that is _unreachable_ in a given 
execution, it will no longer be watched. If your effect is not working, it is most likely caused by the way 
your code is formatted in your effect, causing one or more signals to not be watched.

> Similar to computed signals, effects keep track of their dependencies dynamically, and only 
> track signals which were read in the most recent execution.
> 
>[From the Angular documentation](https://angular.io/guide/signals#effects)

For instance:

```ts
a = signal(false);
b = signal(false);

clickA() {
  console.log("A Clicked");
  this.a.update(val => !val);
}

clickB() {
  console.log("B Clicked");
  this.b.update(val => !val);
}

constructor() {
  effect(() => {
    if (this.a() || this.b()) {
      console.log("EFFECT");
    }
  })
}
```

In this code, we are checking in the effect if `a` or `b` is true, and then do something. Because of the way 
the `or` operator works in JavaScript, if `a` is true, `b` will not be checked, and then will no longer trigger the 
effect on change. This is called “Short-Circuit Evaluation”, or “short circuiting”, and is used by some 
programming languages as a way to increase performance, by not performing checks that are not needed. Here is 
an example console output from the above code. The user clicks the `A` button, then the `B` button. You will notice 
that the `EFFECT` line will not be printed after the user clicks B.

```text
> A Clicked
> EFFECT
> B Clicked
```

## RxJS Solution

Signals are new, and you may be more familiar, or comfortable, using RxJS. In this example, you’d probably want to 
reach for `merge`. Angular now provides a `toObservable` function, which can be used to convert a signal into an 
RxJS observable.

```ts
import { toObservable } from '@angular/core/rxjs-interop';

merge(toObservable(this.a), toObservable(this.b)).subscribe((val) => {
  if (val) {
    console.log('MERGE');
  }
});
```

## Fixing our Effect

[You can play with this example here.](https://stackblitz.com/edit/angular-signals-not-working)

A quick solution, albeit a little strange to look at, would be to call the `getter` on any signal that may not get hit 
in an effect execution:

```ts
effect(() => {
  this.b(); // this will always be read!

  if (this.a() || this.b()) {
    console.log("EFFECT");
  }
})
```

This one-line change will make it so that if `a` is true, we will still have Angular watching the `b` signal, and when it 
changes, the effect will still fire.

[Chau Tran](https://twitter.com/Nartc1410) rightly mentioned to me on Twitter that this could be re-written to 
something a little nicer like this:

```ts
effect(() => {
  const a = this.a();
  const b = this.b();

  if (a || b) {
    console.log("EFFECT");
  }
})
```

Another way to write this is to split this up into two separate effects. Each effect is responsible for “watching” 
a single signal.

```ts
effect(() => {
  if (this.a()) {
    console.log("EFFECT");
  }
})

effect(() => {
  if (this.b()) {
    console.log("EFFECT");
  }
})
```

In conclusion, write your effects while keeping in mind how Angular’s effects “watch” only the signals that were 
read on the previous run. Knowing this will help you when you have an effect that just won’t seem to run!