---
date: 2026-06-26
slug: 2026-06-26-migrating-to-signal-forms
title: 'Goodbye FormGroup: Migrating to Angular Signal Forms'
image: migrating-to-signal-forms.png
avatar: angular-logo.png
categories: angular
tags: angular,signals,forms
---

For a long time, Reactive Forms have been the standard way to handle inputs in Angular. But if you’ve ever built a complex enterprise form, you know they come with a catch: magic strings for control names, clunky RxJS pipelines for basic validation, and loose typing that can hide bugs until runtime.

Angular Signal Forms change this by turning your form into standard reactive state. Instead of listening to a messy stream of events, your form value is just a signal, and your validation rules are clean computed properties.

Let's look at a realistic scenario—a user registration form with a dynamic list of phone numbers and a cross-field password matching check—to see how much cleaner your code looks after migrating.

## The Core Shift: State vs. Events
In classic Reactive Forms, the framework treats the form as a box of events. If you want to know if a form is valid, dirty, or pending, you have to subscribe to streams like statusChanges or imperatively push errors down the control tree.

Signal Forms invert this model:

The Form is Just State: Your form structure mirrors your native reactive data model.

Derived States are Free: Tracking whether a form is valid, or whether two fields match, is no longer calculated via complex validation functions returning nested objects. They are simply computed() signals derived directly from the data.

## The Old Way: Classic FormGroup
In the traditional reactive forms approach, we have to imperatively build out our form tree using FormBuilder. If we want a dynamic list, we have to cast things to a FormArray in the component code.

Even worse, because we're binding elements in the template using strings, if you misspell a control name, the compiler won't warn you. You won't find out until it breaks in the browser.

Component Logic (legacy-register.component.ts)
```ts
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
```

Template (legacy-register.component.html)
```html
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
```

## The Modern Way: Signal Forms
With Signal Forms, the boilerplate vanishes. Because we define the form structure using native reactive fields, we get strict type safety out of the box.

Component Logic (signal-register.component.ts)
```ts
import { Component, signal, computed } from '@angular/core';
import { form, field } from '@angular/forms/signals'; 

@Component({
  selector: 'app-signal-register',
  templateUrl: './signal-register.component.html'
})
export class SignalRegisterComponent {
  // Our form structure perfectly matches our data shape
  formState = form({
    username: field('', { validators: [Validators.required, Validators.minLength(3)] }),
    password: field('', { validators: [Validators.required] }),
    confirmPassword: field('', { validators: [Validators.required] }),
    phones: signal<string[]>([]) // Just a plain old reactive array!
  });

  // Cross-field validation is just a clean, derived computed signal
  passwordsMatch = computed(() => {
    return this.formState.value.password === this.formState.value.confirmPassword;
  });

  // Aggregate form validity setup
  isFormValid = computed(() => {
    return this.formState.valid() && this.passwordsMatch();
  });

  addPhone() {
    this.formState.controls.phones.update(current => [...current, '']);
  }

  removePhone(index: number) {
    this.formState.controls.phones.update(current => current.filter((_, i) => i !== index));
  }

  onSubmit() {
    if (this.isFormValid()) {
      console.log(this.formState.value()); // Completely strongly-typed data shape
    }
  }
}
```

Template (signal-register.component.html)
```html
<form [formGroup]="formState" (ngSubmit)="onSubmit()">
  <div>
    <label for="username">Username</label>
    <input id="username" [formField]="formState.controls.username" />
    
    @if (formState.controls.username.touched() && formState.controls.username.errors.required()) {
      <small class="error">Username is required.</small>
    }
  </div>

  <div>
    <label for="password">Password</label>
    <input id="password" type="password" [formField]="formState.controls.password" />
    @if (formState.controls.password.touched() && formState.controls.password.errors.required()) {
      <small class="error">Password is required.</small>
    }
  </div>

  <div>
    <label for="confirmPassword">Confirm Password</label>
    <input id="confirmPassword" type="password" [formField]="formState.controls.confirmPassword" />
    @if (formState.controls.confirmPassword.touched() && formState.controls.confirmPassword.errors.required()) {
      <small class="error">Confirm password is required.</small>
    }
    @if (formState.touched() && !passwordsMatch()) {
      <small class="error">Passwords must match.</small>
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

  <button type="submit" [disabled]="!isFormValid()">Register</button>
</form>
```

## Why This Makes Life Easier
Look at the difference in how we handle dynamic rows. Instead of pushing and removing items from a rigid, framework-specific FormArray class, we’re just mutating a standard JavaScript array inside an update() block.

In the template, instead of using a string like formControlName="username", we pass the actual signal reference: [formField]="formState.controls.username". If you rename that field in your component file, your build will fail immediately instead of silently making it to production. Future you will thank you for the compile-time safety.

## Handling Advanced Async Validation with the Resource API
In the old ecosystem, asynchronous validation (like hitting an API to see if a username is already taken) meant struggling with RxJS race conditions and manually mapping pending flags.

Signal Forms clean this up by pairing beautifully with Angular's native resource() API. Instead of treating validation as an active event stream, we treat the backend validation status as a reactive network resource derived from the field's value.

```ts
import { Component, computed, inject, resource } from '@angular/core';
import { form, field } from '@angular/forms/signals';
import { UserService } from './user.service';

@Component({
  selector: 'app-signal-register',
  templateUrl: './signal-register.component.html'
})
export class SignalRegisterComponent {
  private userService = inject(UserService);

  formState = form({
    username: field('', { validators: [Validators.required, Validators.minLength(3)] }),
    password: field('', { validators: [Validators.required] }),
    confirmPassword: field('', { validators: [Validators.required] }),
    phones: signal<string[]>([])
  });

  // Only trigger backend network queries if basic local sync rules pass
  usernameQuery = computed(() => {
    return this.formState.controls.username.valid() ? this.formState.controls.username.value() : null;
  });

  // Track availability as an async network resource asset
  usernameAvailability = resource({
    request: () => this.usernameQuery(),
    loader: async ({ request: username }) => {
      if (!username) return { available: true };
      return this.userService.checkUsername(username); // Returns Promise<{ available: boolean }>
    }
  });

  isUsernameValid = computed(() => {
    const isLocalValid = this.formState.controls.username.valid();
    const isAvailable = this.usernameAvailability.value()?.available ?? false;
    return isLocalValid && isAvailable;
  });

  isFormValid = computed(() => {
    const fieldsValid = this.formState.valid();
    const passwordsMatch = this.formState.controls.password.value() === this.formState.controls.confirmPassword.value();
    const asyncValid = this.isUsernameValid() && !this.usernameAvailability.isLoading();

    return fieldsValid && passwordsMatch && asyncValid;
  });
}
```

By leveraging the resource's native .isLoading() status directly in your UI bindings, loading placeholders and form-submission guardrails snap cleanly into place without maintaining messy imperial boolean flags:

```html
@if (usernameAvailability.isLoading()) {
  <small class="info">Checking availability...</small>
}
@if (formState.controls.username.touched() && !usernameAvailability.isLoading() && !isUsernameValid()) {
  <small class="error">That username is already taken.</small>
}
```

## A Tactical Migration Strategy
You don't need to rewrite your entire production codebase in a single pull request to start using this. A great way to ease into it is by migrating leaf nodes—individual reusable custom inputs inside your larger forms—and working your way up.

### Step 1: Upgrade the Custom Control Using FormValueControl
Instead of implementing the verbose ControlValueAccessor interface with its writeValue and registerOnChange boilerplate, your modern custom input component can just use standard Signal Forms primitives.

```ts
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
```

### Step 2: Bind it to your Legacy Parent Form
Because Signal Forms are backwards-compatible, you can drop this brand new child component directly into a traditional parent FormGroup using standard formControlName syntax.

```html
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
```

This lets you slowly upgrade your component library to clean, readable Signal APIs today, while giving your team a direct runway to migrate the parent forms down the road when the timing is right.For a long time...