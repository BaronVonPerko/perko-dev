---
date: 2023-03-07
title: "Angular Pipes: Pure vs Impure"
image: pipes.jpg
categories: angular
tags: angular
---

Angular provides a way to transform data in your templates.  This is done by using a pipe.  A pipe is a function that takes an input value and transforms it to an output value.  For example, the `date` pipe takes a date and formats it to a string.

```html
{{ date | date:'shortDate' }}
```

We can easily create our own pipes using the CLI.

```bash
ng g pipe my-pipe
```

This will create a new file in `src/app/my-pipe.pipe.ts` with the following code:

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myPipe'
})
export class MyPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
```

And it can be used in our template like this:

```html
{{ viewData | myPipe }}
```

> Notice that the pipe's name (myPipe) is the same as the name listed in the Pipe decorator.

## Pure vs Impure Pipes

By default, a Pipe is marked as pure.  This can be changed by setting it in the Pipe decorator like this:

```typescript
@Pipe({
  name: 'myPipe',
  pure: false
})
```

So what makes a pipe "pure"?  Pure pipes are more performant because they are only called when the input value changes.  Because of this, they must be pure functions, meaning that they do not have any side effects or depend on external factors.

For example, a pipe that would transform a `Person` object into a string displaying their name would be pure:

```typescript
@Pipe({
  name: 'personName'
})
export class PersonNamePipe implements PipeTransform {

  transform(person: Person): string {
    return `${person.firstName} ${person.lastName}`;
  }

}
```

Unless the input changes, the transformed output will always be the same.  This is a pure function.

However, if we wanted to create a pipe that would transform a `Person` object into a string displaying their name, but also add the last time they logged into the system, this would not be a pure function:

```typescript
@Pipe({
  name: 'personName',
  pure: false
})
export class PersonNamePipe implements PipeTransform {
  
  loginService = inject(LoginService);

  transform(person: Person): string {
    return `${person.firstName} ${person.lastName} (last logged in: ${this.loginService.getLastLogin(person.id)})`;
  }

}
```

This is not a pure function because it depends on an external factor, the `LoginService`.  This means that the output will change depending on the current state of the `LoginService`.  This is not a pure function, and will be updated for every change detection cycle.

## When to Use Pure vs Impure Pipes

Pure pipes are more performant, but they are limited in what they can do.  If you need to transform data based on external factors, you will need to use an impure pipe.  However, if you can transform the data without depending on external factors, you should use a pure pipe.  

Remember, pipes are pure by default, so unless you need to use an impure pipe, you don't need to do anything special.

I hope this helps you understand the difference between pure and impure pipes.  If you have any questions, feel free to leave a comment below!
