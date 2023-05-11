---
date: 2023-01-30
title: Merging Two Observables of Different Types
image: RxJS.png
categories: rxjs
tags: rxjs
---

Lately, I came across an issue where I needed to merge two different observables into a single
stream and do something with them.  The exact issue was with Angular Material's `MatTable`
with `MatSort` and `MatPaginator`.

Each of these have events that can be subscribed to, `sortChange` and `page` respectively.
The properties we are interested in are `direction` and `active` (from `sortChange`), as 
well as `pageIndex` and `pageSize` (from `page`).

Here's an example of what we are doing.  We are using RxJS's `merge` to take any change
by the `MatSort` or `MatPaginator` and call an API (this is a large dataset, and we want
to leverage server-side sorting and pagination).

```typescript
@ViewChild(MatSort, {static: true}) sort!: MatSort;
@ViewChild(MatPaginator), {static: true} paginator!: MatPaginator;

ngOnInit()
{
  merge(this.sort.sortChange, this.paginator.page).pipe(
    switchMap(({ direction, active, pageIndex, pageSize }) => {
      // call an API with the updated pagination and sorting 
    })
  )
}
```

However, there is a typescript error here.  The value that is passed to the `switchMap` is of type
`Sort | PageEvent`.  The problem is that `Sort` doesn't have `pageIndex` or `pageSize`, and
inversely, `PageEvent` doesn't have `direction` or `active` properties.

## How Can we Merge with Different Observable Types?

Let's make a simpler example, with two streams of people and pets.  People and pets both have
a name, but a person will have an occupation, and a pet will have a species.

```typescript
let people$ = new Subject<Person>();
let pets$ = new Subject<Pet>();

interface Person {
  name: string;
  occupation: string;
}

interface Pet {
  name: string;
  species: 'Cat' | 'Dog';
}
```

Let's add some data to these streams.

```typescript
people$.next({ name: 'Chris', occupation: 'Software Engineer' });
pets$.next({ name: 'Penny', species: 'Dog' });
pets$.next({ name: 'Chloe', species: 'Cat' });
people$.next({ name: 'Veronica', occupation: 'Scientist' });
```

Let's merge both streams together.

```typescript
merge(people$, pets$).pipe(
  tap(result => console.log(result))
).subscribe();
```

Let's take a look at our result:
```text
{name: "Chris", occupation: "Software Engineer"},
{name: "Penny", species: "Dog"},
{name: "Chloe", species: "Cat"},
{name: "Veronica", occupation: "Scientist"}
```

This is great, but let's think about our `MatTable` example.  We need to send an API request
that would have all the details needed.  So, we need to have an object that would have not only
each person or pet's name, but an occupation and a species.  Since **Person** doesn't have a
`species` property, we can leave that blank.  And since **Pet** doesn't have an `occupation`
property, we can leave that blank as well.  How do we handle this?

We can use an RxJS `map` and assert a new type with optional fields.  Then, object destructuring
becomes easy!

```typescript
merge(people$, pets$).pipe(
  map(value => value as {name: string, occupation?: string, species?: 'Dog' | 'Cat'}),
  map(({name, occupation, species}) => ({name, occupation, species})),
  tap(result => console.log(result))
).subscribe();
```

Our result now has all three fields for each entry:

```text
{name: "Chris", occupation: "Software Engineer", species: undefined},
{name: "Penny", occupation: undefined, species: "Dog"},
{name: "Chloe", occupation: undefined, species: "Cat"},
{name: "Veronica", occupation: "Scientist", species: undefined}
```

Here is how the `MatTable` example would look:

```typescript
@ViewChild(MatSort, {static: true}) sort!: MatSort;
@ViewChild(MatPaginator), {static: true} paginator!: MatPaginator;

ngOnInit()
{
  merge(this.sort.sortChange, this.paginator.page).pipe(
    map(value => value as {direction?: string, active?: string, pageIndex?: number, pageSize?: number}),
    switchMap(({ direction, active, pageIndex, pageSize }) => {
      // call an API with the updated pagination and sorting 
    })
  )
}
```

You could of course create interfaces for these types to clean up the `map` a bit.  Depending on how complicated
your type is, it might make more sense to do so.

Do you have any suggestions to make this even better?  Let me know in the comments below!  In case you want to see a
live example, [check out this StackBlitz I created!](https://stackblitz.com/edit/rxjs-vebzbk?devtoolsheight=60&file=index.ts)
