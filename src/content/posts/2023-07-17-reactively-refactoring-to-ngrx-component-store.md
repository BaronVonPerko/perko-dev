---
date: 2023-07-17
title: Reactively Refactoring to NgRX Component Store
image: angular-16-signals.webp
categories: angular
tags: angular,ngrx,component-store
---
Handling state within your Angular components can be a challenge.  There are many 
different ways to handle state, and each has its own pros and cons.  In this 
article, we'll look at how to refactor a component to use NgRX Component Store.

## Example Component

Let's start with a simple component that displays a list of items for a grocery
list.  The component has a few responsibilities:
- Display the list of items
- Allow the user to add a new item
- Allow the user to click an item to mark it as purchased
- Clear all purchased items

An item is a simple object with a name and a boolean indicating whether it has
been purchased or not.

```typescript
interface Item {
  name: string;
  complete: boolean;
}
```

Here's the HTML for the component:

```html
<input type="text" [formControl]="inputCtrl">
<button type="button" (click)="addItem()">Add</button>
<button type="button" (click)="clear()">Clear Crossed Off Items</button>
<ul>
  <li *ngFor="let item of items" (click)="complete(item)">
    <span [class.strike]="item.complete">{{item.name}}</span>
  </li>
</ul>
```

We have a simple input field for adding new items, a button to add the item, a
button to clear all crossed off items, and a list of items.  Each item in the
list has a click handler that marks the item as complete.

When a component is complete, we add the 'strike' class to the item name to
cross it off.  Here's the CSS for that:

```css
.strike {
  text-decoration: line-through;
}
```

Now for the component's code:

```typescript
export default class OriginalComponent {
  inputCtrl = new FormControl('');
  items: Item[] = [
    { name: 'Bread', complete: false },
    { name: 'Eggs', complete: false },
    { name: 'Chicken', complete: false },
  ];

  addItem() {
    if (!this.inputCtrl.value) {
      return;
    }

    this.items.push({ name: this.inputCtrl.value, complete: false });
    this.inputCtrl.setValue('');
  }

  clear() {
    this.items = this.items.filter((item) => !item.complete);
  }

  complete(item: Item) {
    item.complete = !item.complete;
  }
}
```

The component starts off with three items: bread, eggs, and chicken.  The
`addItem` method adds a new item to the list.  The `clear` method removes all
items that have been marked as complete.  The `complete` method toggles the
complete flag for an item.

## Imperitively Checking if the List is Complete

We'd like to add a feature that will display a message stating that the list
is complete if all items have been marked as complete.  We'll start by adding
a method to check if the list is complete, and store the result in a property 
on the component.

```typescript
export default class OriginalComponent {
  // ...
  listComplete = false;

  checkComplete() {
    this.listComplete = this.items.every((item) => item.complete);
  }
}
```

Next, we'll call this method from the `addItem`, `clear`, and `complete` methods.

```typescript
export default class OriginalComponent {
  // ...
  addItem() {
    if (!this.inputCtrl.value) {
      return;
    }

    this.items.push({ name: this.inputCtrl.value, complete: false });
    this.inputCtrl.setValue('');
    this.checkComplete();
  }

  clear() {
    this.items = this.items.filter((item) => !item.complete);
    this.checkComplete();
  }

  complete(item: Item) {
    item.complete = !item.complete;
    this.checkComplete();
  }
}
```

Finally, we'll add a message to the HTML to display the message if the list is
complete.

```html
<em *ngIf="listComplete">List Complete!</em>
```

> This is an _imperitive_ way to do this.  We're telling the component how to
> do something, rather than what to do.  We're also having to remember to call
> the `checkComplete` method from each of the other methods.  This is a
> maintenance nightmare, and it's easy to forget to call the method from a new
> method.

## Reactively Checking if the List is Complete

We could refactor the component to use a reactive approach with RxJS.  To
do this, we would need to create a new Subject to contain the list, and an
Observable to calculate the complete value when the items subject changes.  
We would then need to subscribe to the Subject and update the complete value
when the items change.

```typescript
export default class RxjsComponent {
  inputCtrl = new FormControl('');
  items$ = new BehaviorSubject<Item[]>([
    { name: 'Bread', complete: false },
    { name: 'Eggs', complete: false },
    { name: 'Chicken', complete: false },
  ]);
  listComplete$ = this.items$.pipe(
    map((items) => items.every((item) => item.complete))
  );

  constructor() {
    this.items$.subscribe((items) => {
      this.listComplete$.next(items.every((item) => item.complete));
    });
  }

  addItem() {
    if (!this.inputCtrl.value) {
      return;
    }

    this.items$.next([
      ...this.items$.value,
      { name: this.inputCtrl.value, complete: false },
    ]);
    this.inputCtrl.setValue('');
  }

  clear() {
    this.items$.next(this.items$.value.filter((item) => !item.complete));
  }

  complete(item: Item) {
    item.complete = !item.complete;
    this.items$.next(this.items$.value);
  }
}
```

## NgRX Component Store to the Rescue

NgRX Component Store is a library that provides a reactive way to handle state
within a component.  It's much simpler than the RxJS approach, and it's
easier to read and maintain.

To use NgRX Component Store, we'll need to install the library:

```shell
npm install @ngrx/component-store
```

Next, we'll create a new class that extends the `ComponentStore` class from
NgRX Component Store.  We'll add a property to store the list of items, and
a method to add a new item to the list.