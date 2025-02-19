---
date: 2025-02-19
title: Thinking Reactively with Angular Signals
image: epic-angular.png
avatar: angular-logo.png
categories: angular
tags: angular,signals
---

### What is Reactive Programming?

You've probably heard the terms "reactive" or "declarative" programming and wonder what that means. This differs
from "imperative" programming, and by changing your thinking, can help you create more testable and readable code.

In an imperative approach, the code follows a step-by-step set of instructions to get something done. With a
reactive approach, we describe how we want our data to react to changes elsewhere in our application.

Let's look at an example of an imperative approach, and think about how this may be difficult to maintain.

```ts
class MyComponent {
  list = [];
  listCount = 0;
  newItem = ''

  addItem() {
    this.list.push(this.newItem);
    this.newItem = '';
    this.listCount += 1;
  }
}
```

In this component, we have a list of items, and the user can add a custom item. Once a new item is added,
we want to clear the input text so the user can add another. We are also tracking how many items are in the list.

Although this works, we should try and think about how this component may be expanded upon in the future. What
if the list items can be removed? What if there is another event, such as a websocket, that will update the list?

In all of these cases, we need to think about how this affects the other properties, such as the list count or 
the new item string. It will be easy to miss one of these cases and have a list count that doesn't actually
match the number of items in the list.

### Introducing Signals

Signals are relatively new to Angular, and make writing reactive code quite simple. In the past, we relied on
RxJS to handle making our code more reactive, which comes with a steep learning curve.

With signals, we can easily "watch" them and react to changes. Let's first refactor our code to use signals,
but we will keep with the imperative approach for now.

```ts
class MyComponent {
  list = signal([]);
  listCount = signal(0);
  newItem = signal('');

  addItem() {
    this.list.update(list => [...list, this.newItem()]);
    this.newItem.set('');
    this.listCount.update(listCount => listCount + 1);
  }
}
```

> Note that we must update the list in an immutable way, which is why we are creating a new array and 
> using the spread operator.

Here we are using `update` and `set` to modify the values of a signal. When either of these two functions
are called on a signal, any place where the signal values are _read_ will be notified (including within your
template).

### Computed Signals

Computed signals are **read-only** signals. These are useful when you want to make some sort of calculation based
on the values of one or more other signals. We can use this to refactor our `listCount` so that we no longer
have to manually update the value whenever we add or remove from the `list`.

Since we are reading the `list` signal within our `computed` function, Angular will automatically track
the `list` signal and re-compute every time it is updated.

```ts
class MyComponent {
  list = signal([]);
  listCount = computed(() => this.list().length);
  newItem = signal('');

  addItem() {
    this.list.update(list => [...list, this.newItem()]);
    this.newItem.set('');
  }
}
```

### Linked Signals

It would be nice to also have the `newItem` signal _reset_ itself when the list changes, such as adding a new
value. By using a [linked signal](https://angular.dev/guide/signals/linked-signal), we can _link_ our `newItem`
signal to the `list` signal, and do something when it changes.

> As of the time of writing this, Linked Signals are in developer preview.

```ts
class MyComponent {
  list = signal([]);
  listCount = computed(() => this.list().length);
  newItem = linkedSignal(() => {
    this.list();
    return '';
  })

  addItem() {
    this.list.update(list => [...list, this.newItem()]);
  }
}
```

Inside our `linkedSignal` function, we are reading the value from the `list` signal. Although we aren't doing
anything with that value, because we are reading it, the `linkedSignal` will track any changes to `list`, causing
this function to re-compute when `list` is updated. This will also run once when instantiated, so the
default value will still be an empty string.

In our case, we always want to reset the value to an empty string. If you have a more complex use-case, you can
write your logic here and return what you want the `newItem` value to be.

The signature is very similar to `computed`. However, the main difference is that `linkedSignal` is a 
**writable signal**, allowing the user to make changes to it (such as typing into a form input).

The `addItem()` function no longer has a step-by-step set of instructions on modifying anything other than adding
a value to the list.

The `listCount` and `newItem` signals are reactive, updating automatically when the `list` signal is modified.

Going back to our original example, think about how much easier this will be when we add a "remove" button to the
items in the list, or the server updates the list from an HTTP call or websocket. We no longer have to remember
to update other parts of our component, as those features are reactive to any change to the list of items.