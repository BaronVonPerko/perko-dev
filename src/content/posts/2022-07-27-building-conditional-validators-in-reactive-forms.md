---
date: 2022-07-27
title: Building Conditional Validators in Reactive Forms
image: angular-rxjs.jpg
categories: angular,rxjs
tags: rxjs,angular,forms
---
> This post was also published to the official 
> [HeroDevs blog on medium](https://medium.com/herodevs/building-conditional-validators-in-reactive-forms-c2f4a9242c0a).
> If you prefer a video explanation, this content was based on a lightning talk
> that I gave at the [Angular Community Meetup](https://angularcommunity.net/home).
> [The video can be found here.](https://www.youtube.com/watch?v=E9RDS7lcQns&t=3m25s)

Reactive forms in Angular provide a powerful way to validate your user’s 
inputs in a declarative style. But what happens when the validation rules 
depend on another form control’s value? Here’s an example problem that 
we will use to learn how to write conditional validators in reactive forms.

Let’s say we have a form to register for a website. One of the fields asks 
for the user’s age. We have a requirement that any user under the age of 13 
must also provide a parent’s email address. In this instance, we could create 
a class to hold all of the requirements of this form.

**login.form.ts**
```typescript
import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Injectable()
export default class LoginForm {
    group!: FormGroup;    
    minAge = 13;

    constructor() {
        this.group = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            age: new FormControl('', [Validators.required]),
            parentEmail: new FormControl('', [Validators.required, Validators.email]),
        });
    }
}
```

This **LoginForm** class has two properties, the Form Group and a 
number property to hold the minimum age for our site. Our constructor will 
set up the Form Group and assign validators to each field.

Next, we need a presentational component to display our login form. The 
component simply injects the **LoginForm** class that we created above. 
The template is using [Angular Material](https://material.angular.io/) for 
some added styling.

**login.component.html**
```html
<form [formGroup]="loginForm.group" class="login-form">
    <mat-form-field *ngIf="loginForm.group.get('email'); let email">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" type="email" />
        <mat-error *ngIf="email.errors?.['email'] || email.errors?.['required']">
            A valid email address is required.
        </mat-error>
    </mat-form-field>

  <mat-form-field *ngIf="loginForm.group.get('age'); let age">
      <mat-label>Age</mat-label>
      <input matInput type="number" formControlName="age">
      <mat-error *ngIf="age.errors?.['required']">
          Age is required.
      </mat-error>
  </mat-form-field>

  <ng-container *ngIf="loginForm.group.get('age')?.value < loginForm.minAge">
      <mat-form-field *ngIf="loginForm.group.get('parentEmail'); let parentEmail">
          <mat-label>Parent Email</mat-label>
          <input matInput formControlName="parentEmail" type="email">
          <mat-error *ngIf="parentEmail.errors?.['email'] || parentEmail.errors?.['required']">
              A valid email address is required.
          </mat-error>
      </mat-form-field>
  </ng-container>

  <button mat-raised-button color="primary">Login</button>

  <h4>Form Valid: {{loginForm.group.valid}}</h4>
</form>
```

**login.component.ts**
```typescript
import { Component } from "@angular/core";
import LoginForm from "./login.form";

@Component({
    selector: 'acm-demos-login',
    templateUrl: './login.component.html',
    providers: [LoginForm]
})
export default class LoginComponent {
    constructor(public loginForm: LoginForm) {}
}
```

We have three form fields, **email address**, **age**, and **parent’s email address**. 
The third form is _dependent_ on the value of the **age** field.

We have an `*ngIfdirective` that will handle showing and hiding the 
**parent’s email address** field depending on the **age** (it is shown if the 
user is not at least the minimum age requirement, as specified in our 
**LoginForm** class).

## What's the Problem?

So, if the form control in question (**parent’s email address**) is being 
shown only when needed, what is the problem with our site? Let’s try 
logging in with a user that is older than the required 13 years of age.

![Logging in with a user under the age of 13](/assets/images/dynamic-form-validator-1.png)

We’ve added a debug line to display the validity of our form. The form 
is invalid here because even though we do not display the 
**parent’s email address** form field, it still has _validators_ 
associated with it within our **LoginForm** class. This is an instance where 
we need to use conditional validators.

## How to Add Conditional Validators to Our Form Definition

We want to keep all of our login associated with the form within our
**LoginForm** class, and not have logic in both the **LoginForm** and our 
presentational component. We can use reactive programming to add in 
our conditional validation logic by hooking into the _valueChanges_ 
event on our **age** form control.

Here is an updated version of our **LoginForm** class:

```typescript
import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, tap } from "rxjs";

@Injectable()
export default class LoginForm {
    group!: FormGroup;    
    minAge = 13;
    valueChanged$: Observable<null> | undefined;

    constructor() {
        this.group = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            age: new FormControl('', [Validators.required]),
            parentEmail: new FormControl(''),
        });

        this.valueChanged$ = this.group.get('age')?.valueChanges
        .pipe(
            tap(age => {
                const parentEmailCtrl = this.group.get('parentEmail');

                if (age && age < this.minAge) {
                    parentEmailCtrl?.setValidators([Validators.required, Validators.email])
                } else {
                    parentEmailCtrl?.clearValidators();
                }

                parentEmailCtrl?.updateValueAndValidity();
            })
        );
    }
}
```

We’ve added a `valueChanged$` property to the class and assigned it to 
the `valueChanges` observable that is provided by Angular’s reactive forms. We can then add our functionality to this event, by piping in our validation logic.

I used the `tap` operator, as we are performing a side-effect. In this 
case, when the **age** is changed, we want to update the validation 
rules for the **parent email** control.

Line 21 grabs the control from our form group.

Lines 23–27 perform a simple check, and based on the age, sets the appropriate validators, or clears them.

Finally, on line 29, we perform `updateValueAndValidity()`. This is an 
important step to let Angular know that the value or the validation rules 
have changed on our control, and we want the **parent email** control to 
be re-evaluated.

## Don't Forget to Subscribe!

In order for any observable to actually do anything, it needs to be 
subscribed to. We could subscribe within the **LoginForm** class, but then we 
will need to remember to unsubscribe when we are no longer using this 
form. A great solution for handling this is to use the _async_ pipe provided 
by Angular. This pipe will handle subscribing and unsubscribing for us. We 
can utilize this by adding a single line to our presentational component. 
You can see this in line 1 in the gist below:

```html
<ng-container *ngIf="loginForm.valueChanged$ | async"></ng-container>

<form [formGroup]="loginForm.group" class="login-form">
    <mat-form-field *ngIf="loginForm.group.get('email'); let email">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" type="email" />
        <mat-error *ngIf="email.errors?.['email'] || email.errors?.['required']">
            A valid email address is required.
        </mat-error>
    </mat-form-field>

    <mat-form-field *ngIf="loginForm.group.get('age'); let age">
        <mat-label>Age</mat-label>
        <input matInput type="number" formControlName="age">
        <mat-error *ngIf="age.errors?.['required']">
            Age is required.
        </mat-error>
    </mat-form-field>

    <ng-container *ngIf="loginForm.group.get('age')?.value < loginForm.minAge">
        <mat-form-field *ngIf="loginForm.group.get('parentEmail'); let parentEmail">
            <mat-label>Parent Email</mat-label>
            <input matInput formControlName="parentEmail" type="email">
            <mat-error *ngIf="parentEmail.errors?.['email'] || parentEmail.errors?.['required']">
                A valid email address is required.
            </mat-error>
        </mat-form-field>
    </ng-container>

    <button mat-raised-button color="primary">Login</button>

    <h4>Form Valid: {{loginForm.group.valid}}</h4>
</form>
```

With this simple change, the `valueChanged$` observable we created will 
be subscribed to, allowing it to update the validation rules on our 
**parent email** control whenever the age is updated.

If you’d like to view the complete source code, you can check out this 
repository I created using Nx: 
[https://github.com/BaronVonPerko/acm-demos](https://github.com/BaronVonPerko/acm-demos).
