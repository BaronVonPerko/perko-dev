---
date: 2019-03-25
title: Angular / DevExpress Input Mask Issue with Non-Required Fields
image: devexpress.png
categories:
tags: devexpress,angular
---
I'm working on a new project that is utilizing [DevExpress](https://www.devexpress.com/) components with Angular (v7). These components allow you to quickly setup forms that work with your API, and save you a lot of manual coding. However, I've come across a problematic issue with the text inputs and masks.

## The Problem

The problem is this: we have inputs for phone numbers on these forms. Not all of these inputs are required (such as mobile and fax numbers). Here is an example of one of our fields that has a mask:

```html
<dxi-item dataField="homePhone"
  [editorOptions]="{ mask: '###-###-####', useMaskedValue: 'true'}">
  <dxi-validation-rule type="pattern" [pattern]="phonePattern" message="Phone must have a valid USA format: ###-###-####"></dxi-validation-rule>
</dxi-item>
```

There is nothing in this code requiring the user to fill out this form. With a new form, everything works just fine. However, if you open a form to edit that already has a home phone and you clear the input, you will see an error when the input loses focus. The error comes from our validation rule that makes sure that the phone number is in the right format (the useMaskedValue attribute is there so the value of the input includes the hyphens between each set of numbers).

The validation error occurs because after clearing the input, the value of the component is not null, it is actually " - -". Strange, right?

## A Simple Solution

The quick solution here is to fire an event when the *blur* event happens on the input element. To do this, we need to just add the *onFocusOut* attribute to our *editorOptions* on the dxi-item element.

```html
<dxi-item dataField="homePhone"
  [editorOptions]="{ mask: '###-###-####', useMaskedValue: 'true', onFocusOut: onValidateNonRequiredPhoneField }">
...
```

Now that the html is taken care of, let's create a function in our component to handle the event. Make sure you bind the function in the constructor so that the DevExpress component is wired up correctly.

```typescript
constructor() {
  ...
 
  this.onValidateNonRequiredPhoneField = this.onValidateNonRequiredPhoneField.bind(this);
}
 
onValidateNonRequiredPhoneField(event: any) {
    const phoneComponent: any = event.component;
    const value: string = phoneComponent.option('value');
 
    if (value === '   -   -') {
      phoneComponent.option('isValid', true);
      phoneComponent.option('value', null);
    }
  }
```

Once you have the component, you can use the .option() to get and set attributes on your DevExpress component programmatically! Setting the value to null and the isValid to true will allow the form to save correctly.

*Note, this does not work for a mask like '000-000-0000'. This mask does not allow for spaces, so it weirdly overrides the isValid attribute and invalidates the form control. Using '###-###-####' works fine.*

