---
date: 2022-05-06
title: Handling Async Pipe with Boolean Result
image: angular-rxjs.jpg
categories: angular,rxjs
tags: rxjs,angular
---

The [async pipe](https://seedpro-dv.corteva.com/#/permField/addPermField?pchsId=PRI1-010-2021-3) is a powerful tool that helps you subscribe to observables within your Angular application, and not need to worry about cleaning them up when the component is destroyed.  

It's best, if possible, to never subscribe to observables, and use the **async pipe** instead.  This is not always possible, but it's a good goal to strive for.

## The Problem with Boolean Results

You may have a scenario where the observable you are subscribing to returns a *boolean* result.  When returning an array of results, we usually use the **async pipe** within an **ngFor** directive.  However, when we're dealing with an object (or in this case a boolean), we use the **ngIf** directive.

Let's create a simple example.  Say we have a service that will return whether or not the given user's account is active or not.  We will provide it the username, and it will return back *true* or *false*.

```typescript
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({providedIn: 'root'})
export default class UserActiveService {

  GetUserActiveState(username: string): Observable<boolean> {
    if (username === 'chris') {
      return of(true);
    }
    else {
      return of(false);
    }
  }
}
```

In real life, this would probably be talking to a web server, but for this example only the account that has a username of 'chris' is active.

Let's create a component that will simply display the user's account status.

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import UserActiveService from './user-active.service';

@Component({
  selector: 'user-info',
  template: `
    <p *ngIf="active$ | async; let active">
        User active state: {{active}}
    </p>`,
})
export class UserInfoComponent implements OnInit {
  active$!: Observable<boolean>;

  constructor(private _service: UserActiveService){}

  ngOnInit() {
    this.active$ = this._service.GetUserActiveState('chris');
  }
}
```

When we initialize our component, we get our boolean observable back.  We then use it within our template along with the **async** pipe, and assign the results to a variable called *active*.  

Currently, we are passing in the username of 'chris', which returns true, and the browser displays the text correctly.

![Updated block with text input](/assets/images/angular-async-pipe-true.jpeg)

However, if we change the username to something like 'bob', the entire text disappears.  We would rather it say "User active state: false".  How do we accomplish this?  When the observable passes back *false*, the **ngIf** directive remove the DOM element from the page.

## Using ngIfElse 

One way, for this particular example, to get around this is to use the **ngIfElse** directive.  We can update our template as follows:

```html
<p *ngIf="active$ | async; let active; else inactive">
    User active state: {{active}}
</p>
<ng-template #inactive>
    <p>User active state: false</p>
</ng-template>`,
```

However, depending on how complex your template is, this may not always be ideal.

## Using switchMap

Another solution, is to use *switchMap*, which is a really cool rxjs operator.  [switchMap](https://rxjs.dev/api/operators/switchMap) allows you to manipulate the result from an observable, changing it into a different observable.

So how could we use this to solve our problem?

What if we are expecting an object, with a value of a boolean, instead of just a boolean?  Let's update our observable to reflect what we *want* to have for our template.

```typescript
// before
active$!: Observable<boolean>;

// after
active$!: Observable<{value: boolean}>;
```

Now, we can use *switchMap* to transform the result we get from our service into the format that we need.

```typescript
ngOnInit() {
    this.active$ = this._service.GetUserActiveState('chris').pipe(
        switchMap(active => of({value: active}))
    );
}
```

Lastly, we just need to update our template to use the new *value* property on the *active* object.  Here is the completed component:

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import UserActiveService from './user-active.service';

@Component({
  selector: 'user-info',
  template: `
  <p *ngIf="active$ | async; let active">
    User active state: {{active.value}}
  </p>`,
})
export class UserInfoComponent implements OnInit {
  active$!: Observable<{value: boolean}>;

  constructor(private _service: UserActiveService){}

  ngOnInit() {
    this.active$ = this._service.GetUserActiveState('chris').pipe(
      switchMap(active => of({value: active}))
    );
  }
}
```

[I've also created a StackBlitz example for you to review and play with as well.](https://stackblitz.com/edit/perko-async-pipe-boolean)  Happy coding!
