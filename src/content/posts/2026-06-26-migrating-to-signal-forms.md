---
date: 2026-06-26
slug: 2026-06-26-migrating-to-signal-forms
title: 'Goodbye FormGroup: Migrating to Angular Signal Forms'
image: migrating-to-signal-forms.png
avatar: angular-logo.png
categories: angular
tags: angular,signals,forms
hidden: true
---

For a long time, Reactive Forms have been the standard way to handle inputs in Angular. But if you’ve ever built a complex enterprise form, you know they come with a catch: magic strings for control names, clunky RxJS pipelines for basic validation, and loose typing that can hide bugs until runtime.

Angular Signal Forms change this by turning your form into standard reactive state. Instead of listening to a messy stream of events, your form value is just a signal, and your validation rules are clean computed properties.

Let's look at a realistic scenario—a user registration form with a dynamic list of phone numbers and a cross-field password matching check—to see how much cleaner your code looks after migrating.

## The Core Shift: State vs. Events
In classic Reactive Forms, the framework treats the form as a box of events. If you want to know if a form is valid, dirty, or pending, you have to subscribe to streams like statusChanges or imperatively push errors down the control tree.

Signal Forms invert this model:

The Form is Just State: Your form structure mirrors your native reactive data model.

Derived States are Free: Tracking whether a form is valid, or whether two fields match, is no longer calculated via complex validation functions returning nested objects. They are handled by centralized schema validation rules that automatically track dependencies under the hood.

## The Old Way: Classic FormGroup
In the traditional reactive forms approach, we have to imperatively build out our form tree using FormBuilder. If we want a dynamic list, we have to cast things to a FormArray in the component code.

Even worse, because we're binding elements in the template using strings, if you misspell a control name, the compiler won't warn you. You won't find out until it breaks in the browser.

#### Component Logic (legacy-register.component.ts)
TypeScript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';

@Component({
selector: 'app-legacy-register',
templateUrl: './legacy-register.component.html'
})
export class LegacyRegisterComponent implements OnInit {
registerForm!: FormGroup;

constructor(private fb: FormBuilder) {}

ngOnInit() {
this.registerForm = this.fb.group({
username: ['', [Validators.required, Validators.minLength(3)]],
password: ['', Validators.required],
confirmPassword: ['', Validators.required],
phones: this.fb.array([])
}, { validators: this.passwordMatchValidator });
}

get phones() {
return this.registerForm.get('phones') as FormArray;
}

addPhone() {
this.phones.push(this.fb.control('', Validators.required));
}

removePhone(index: number) {
this.phones.removeAt(index);
}

passwordMatchValidator(control: AbstractControl) {
const password = control.get('password')?.value;
const confirmPassword = control.get('confirmPassword')?.value;
return password === confirmPassword ? null : { passwordMismatch: true };
}

onSubmit() {
if (this.registerForm.valid) {
console.log(this.registerForm.value); // Type is implicitly 'any'
}
}
}
Template (legacy-register.component.html)
HTML
<form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="username">Username</label>
    <input id="username" formControlName="username" />
    @if (registerForm.get('username')?.touched && registerForm.get('username')?.hasError('required')) {
      <small class="error">Username is required.</small>
    }
  </div>

  <div>
    <label for="password">Password</label>
    <input id="password" type="password" formControlName="password" />
  </div>

  <div>
    <label for="confirmPassword">Confirm Password</label>
    <input id="confirmPassword" type="password" formControlName="confirmPassword" />
    @if (registerForm.touched && registerForm.hasError('passwordMismatch')) {
      <small class="error">Passwords must match.</small>
    }
  </div>

  <div formArrayName="phones">
    @for (phone of phones.controls; track $index) {
      <div>
        <input [formControlName]="$index" placeholder="Phone Number" />
        <button type="button" (click)="removePhone($index)">Remove</button>
      </div>
    }
    <button type="button" (click)="addPhone()">Add Phone</button>
  </div>

<button type="submit" [disabled]="registerForm.invalid">Register</button>
</form>
The Modern Way: Signal Forms
With Signal Forms, the boilerplate vanishes. Because we define the form structure using native reactive fields, we get strict type safety out of the box.

Instead of detached validation functions that traverse the form tree using string paths, Signal Forms keep validation localized within a central schema execution callback. When you use validate(), you get a context that tracks dependencies automatically. Any signal value you check inside that block automatically registers as a dependency and re-evaluates when values change.

Component Logic (signal-register.component.ts)
TypeScript
import { Component, signal } from '@angular/core';
import { form, field, validate, required, minLength } from '@angular/forms/signals';

@Component({
selector: 'app-signal-register',
templateUrl: './signal-register.component.html'
})
export class SignalRegisterComponent {

// Define the form fields and structural rules in one central schema path setup
formState = form({
username: field(''),
password: field(''),
confirmPassword: field(''),
phones: signal<string[]>([]) // Just a plain old reactive array!
}, (schemaPath) => {

    // Attach built-in synchronous validators to specific paths
    required(schemaPath.username, { message: 'Username is required.' });
    minLength(schemaPath.username, 3, { message: 'Must be at least 3 characters.' });
    required(schemaPath.password, { message: 'Password is required.' });
    
    // Custom cross-field validation rule
    validate(schemaPath.confirmPassword, (ctx) => {
      const passwordValue = ctx.valueOf(schemaPath.password);
      const confirmValue = ctx.value(); // Current field value
      
      if (!confirmValue) {
        return { kind: 'required', message: 'Confirm password is required.' };
      }
      
      if (passwordValue !== confirmValue) {
        return { kind: 'passwordMismatch', message: 'Passwords must match.' };
      }
      
      return null; // Valid!
    });
});

addPhone() {
this.formState.controls.phones.update(current => [...current, '']);
}

removePhone(index: number) {
this.formState.controls.phones.update(current => current.filter((_, i) => i !== index));
}

onSubmit() {
if (this.formState.valid()) {
console.log(this.formState.value()); // Completely strongly-typed data shape
}
}
}
Template (signal-register.component.html)
HTML
<form [formGroup]="formState" (ngSubmit)="onSubmit()">
  <div>
    <label for="username">Username</label>
    <input id="username" [formField]="formState.controls.username" />

    @if (formState.controls.username.touched() && formState.controls.username.errors.required()) {
      <small class="error">{{ formState.controls.username.errors.required().message }}</small>
    }
  </div>

  <div>
    <label for="password">Password</label>
    <input id="password" type="password" [formField]="formState.controls.password" />
    @if (formState.controls.password.touched() && formState.controls.password.errors.required()) {
      <small class="error">{{ formState.controls.password.errors.required().message }}</small>
    }
  </div>

  <div>
    <label for="confirmPassword">Confirm Password</label>
    <input id="confirmPassword" type="password" [formField]="formState.controls.confirmPassword" />

    @if (formState.controls.confirmPassword.touched()) {
      @if (formState.controls.confirmPassword.errors.passwordMismatch()) {
        <small class="error">{{ formState.controls.confirmPassword.errors.passwordMismatch().message }}</small>
      }
      @if (formState.controls.confirmPassword.errors.required()) {
        <small class="error">{{ formState.controls.confirmPassword.errors.required().message }}</small>
      }
    }
  </div>

  <div>
    @for (phoneControl of formState.controls.phones(); track $index) {
      <div>
        <input [formField]="phoneControl" placeholder="Phone Number" />
        <button type="button" (click)="removePhone($index)">Remove</button>
      </div>
    }
    <button type="button" (click)="addPhone()">Add Phone</button>
  </div>

<button type="submit" [disabled]="!formState.valid()">Register</button>
</form>
Why This Makes Life Easier
Look at the difference in how we handle dynamic rows. Instead of pushing and removing items from a rigid, framework-specific FormArray class, we’re just mutating a standard JavaScript array inside an update() block.

In the template, instead of using a string like formControlName="username", we pass the actual signal reference: [formField]="formState.controls.username". If you rename that field in your component file, your build will fail immediately instead of silently making it to production. Future you will thank you for the compile-time safety.

A Tactical Migration Strategy
You don't need to rewrite your entire production codebase in a single pull request to start using this. A great way to ease into it is by migrating leaf nodes—individual reusable custom inputs inside your larger forms—and working your way up.

Step 1: Upgrade the Custom Control Using FormValueControl
Instead of implementing the verbose ControlValueAccessor interface with its writeValue and registerOnChange boilerplate, your modern custom input component can just use standard Signal Forms primitives.

TypeScript
import { Component, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
selector: 'app-custom-toggle',
standalone: true,
template: `
    <div class="toggle-container" [class.active]="value()" (click)="toggle()">
      <div class="knob"></div>
    </div>
  `,
styleUrls: ['./custom-toggle.component.css']
})
export class CustomToggleComponent implements FormValueControl<boolean> {
// A simple model signal replaces all traditional CVA boilerplate!
value = model(false);

toggle() {
this.value.update(current => !current);
}
}
Step 2: Bind it to your Legacy Parent Form
Because Signal Forms are backwards-compatible, you can drop this brand new child component directly into a traditional parent FormGroup using standard formControlName syntax.

HTML
<form [formGroup]="settingsForm" (ngSubmit)="onSubmit()">
  <div>
    <label>Email Address</label>
    <input formControlName="email" type="email" />
  </div>

  <div>
    <label>Enable Push Notifications</label>
    <app-custom-toggle formControlName="notificationsEnabled"></app-custom-toggle>
  </div>

<button type="submit">Save Settings</button>
</form>
This lets you slowly upgrade your component library to clean, readable Signal APIs today, while giving your team a direct runway to migrate the parent forms down the road when the timing is right.