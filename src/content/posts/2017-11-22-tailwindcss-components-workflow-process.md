---
date: 2017-11-22
title: TailwindCSS Components Workflow Process
image: login.png
categories: Front-End Development
tags: css,laravel,tailwind
---
Last week, I wrote about my initial views of TailwindCSS.  I had a lot of interest from readers on Twitter to continue the post to cover the components aspect of Tailwind.  The Tailwind docs do contain a page on [how to extract components](https://tailwindcss.com/docs/extracting-components/#app) already, so I want to take this time to cover my workflow and thought process on extracting components in an app.  In this article, I will be using the starter Laravel app, along with Laravel mix.  If you are unfamiliar with Laravel, that is okay, we will be mostly covering the HTML/CSS, and using Laravel as a jumping off point.  The source code for this project can be [found on github](https://github.com/BaronVonPerko/tailwind-components).

## Project Setup

To get things started, I used the Laravel installer to scaffold out a blank application:

```bash
laravel new tailwind-components

cd tailwind-components

npm install

php artisan make:auth
```

Next step is to install Tailwind:

```bash
npm install tailwindcss --save-dev
```

Now that we are done scaffolding our app, we have a layout file at **resources/views/layouts/app.blade.php**, and the main file we will work with today at **resources/views/welcome.blade.php**.  Let's go into **welcome.blade.php** and remove everything from the file, and start with a blank canvas.  We will now enter the following code to utilize the main **app.blade.php** layout file.

```php
@extends('layouts.app')
 
@section('content')
 
@endsection
```

All of our code will exist between the **@section('content')** and **@endsection** blade directives.  Let's now visit **app.blade.php** and set it up.  We will remove the pre-built navigation bar so that we can build our own using Tailwind.  The body section of your file should look like this:

```php
<body>
<div id="app">
@yield('content')
</div>
 
<!-- Scripts -->
<script src="{{ asset('js/app.js') }}"></script>
</body>
```

The last bit is to setup Tailwind.  Open up **webpack.mix.js** and change it to look like the following:

```javascript
let mix = require('laravel-mix');
let tailwindcss = require('tailwindcss');
 
mix.js('resources/assets/js/app.js', 'public/js')
    .sass('resources/assets/sass/app.scss', 'public/css')
    .options({
    processCssUrls: false,
    postCss: [
        tailwindcss('./tailwind.js')
    ]
});
```

[Per the Tailwind installation docs](https://tailwindcss.com/docs/configuration), we need to setup the **tailwind.js** file that we have set on line 9 of our mix file.

```bash
./node_modules/.bin/tailwind init tailwind.js
```

For this example, we are going to leave the generated **tailwind.js** config file alone, and focus only on our components.  Last step for our project setup is to clear out **resources/assets/sass/app.scss** and set it to use the Tailwind preflight and utilities:

```css
@tailwind preflight;
 
// Add component files here.
 
@tailwind utilities;
```

## Setting up the Navigation Bar

Let's build a basic navigation bar using the Tailwind utilities.  We just need a bar with a title, we can always add links later if we choose.

```php
<div id="app">
    <nav class="py-4 px-2 mb-4 bg-grey-lightest shadow-md">
        <span class="font-medium">Tailwind Components</span>
    </nav>
    
    @yield('content')
</div>
```

![Navbar Image](/assets/images/navbar-tailwind.png)

Now we must think about if this could make use of turning all of those classes into a component or not.  Since we are using a layout file that all of our pages will inherit, I do not think it is worth it to make a component for the navbar.  This is easy enough to update here in the HTML if we ever want to change the styles.

## Application Buttons

We know that our app will need to use buttons.  Let's style one up using the Tailwind utilities, and then create a component for them.  For this example, we will be putting all of our code in the **welcome.blade.php** file, inside of the **@section('content')**.  I'll first wrap all of these buttons that we will create into a container and center it, just to make it look a little nicer.

```html
<div class="container px-4 mx-auto text-center">
    <button class="px-4 py-2 rounded shadow bg-blue hover:bg-blue-dark text-white">
        Button
    </button>
</div>
```

This is great!  We were able to use the utility classes to design a button that we want to use within our app.  Since we know we will need many buttons, this is a perfect candidate to turn it into a component.  Let's create a new file for our buttons: **resources/assets/sass/buttons.scss**, and load it into our **app.scss** file.

```css
@tailwind preflight;
 
// Add component files here.
@import 'buttons';
 
@tailwind utilities;
```

Now within our newly created **buttons.scss** file, we will create a class *.btn*.  Note, that the hover attributes cannot be used as a class name, and must use the CSS *:hover* selector.

```css
.btn {
    @apply .px-4 .py-2 .rounded .shadow .bg-blue .text-white;
    
    &:hover {
        @apply .bg-blue-dark;
    }
}
```

We can now change all of those classes on our button element to use just btn.  The @apply directive that ships with Tailwind allows this magic to happen above.  We are now looking at a very clean file that clearly states what our buttons look like.  However, we now need to have a couple other button types: one that is a light grey, and one that is red.  All of the buttons should look the same other than the colors, so we will want to extract the reusable utilities.  Later on, if we are asked to change the buttons to not have rounded corners, we will only have one class to change.  Here is how it will look:

```css
.btn {
    @apply .px-4 .py-2 .rounded .shadow;
}
 
.btn-primary {
    @apply .bg-blue .text-white;
    
    &:hover {
        @apply .bg-blue-dark;
    }
}
 
.btn-normal {
    @apply .bg-grey-lightest;
    
    &:hover {
        @apply .bg-grey-lighter;
    }
}
 
.btn-danger {
    @apply .bg-red-light .text-white;
    
    &:hover {
        @apply .bg-red;
    }
}
```

That's it!  We have just a few lines of code that completely define how we want our buttons to look.  Each button will use the btn class, as well as a class to denote what color to use. Here is an example of using these classes:

```html
<button class="btn btn-primary">
    Button
</button>
 
<button class="btn btn-normal">
    Normal
</button>
 
<button class="btn btn-danger">
    Danger
</button>
```

![Tailwind Buttons](/assets/images/tailwind-buttons.png)

## Building Some Forms

Forms are also an important part of any application.  Let's steal an example form from the [Tailwind examples](https://tailwindcss.com/docs/examples/forms).  We are going to use the first login form example.  Our app needs to have a login form, but also a registration form.  It would be nice if they looked the same.  We may need other forms in the future, so having components for each of these inputs would be nice.

```html
<div class="w-full max-w-xs">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
            <label class="block text-grey-darker text-sm font-bold mb-2" for="username">
                Username
            </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="username" type="text" placeholder="Username">
            </div>
            <div class="mb-4">
                <label class="block text-grey-darker text-sm font-bold mb-2" for="password">
                    Password
                </label>
                <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3" id="password" type="password" placeholder="******************">
                <p class="text-red text-xs italic">Please choose a password.</p>
            </div>
            <div class="flex items-center justify-between">
                <button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded" type="button">
                    Sign In
                </button>
                <a class="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker" href="#">
                    Forgot Password?
                </a>
            </div>
        </div>
    </form>
    <p class="text-center text-grey text-xs">
        ©2017 Acme Corp. All rights reserved.
    </p>
</div>
```

Whoa! That's a lot of classes! Let's take a look at what we can already change: the button. We want the button to match our primary button, so by just changing the class to be .btn .btn-primary, we will have it match our theme. We also have a link here for 'Forgot Password'. We should have our links all look the same on the site. Let's make a file for HTML elements: **resources/assets/sass/elements.scss**.

```css
a {
    @apply .inline-block .align-baseline .font-bold .text-sm .text-blue;
 
    &:hover {
        @apply .text-blue-darker;
    }
}
```

We can now remove all of the classes from the Forgot Password hyperlink. Be sure to include this new file in **app.scss**.

```css
@tailwind preflight;
 
// Add component files here.
@import 'buttons';
@import 'elements';
 
@tailwind utilities;
```

We may or may not want all forms to look the same. Let's say we want the login and register forms to exist in this small white card, and others will not have these features. We can refactor the classes on the form tag into a component. We will create a new file: **resources/assets/sass/forms.scss**, and you guessed it, we will need to import it into app.scss.

```css
form.login-register-form {
   @apply .bg-white .shadow-md .rounded .px-8 pt-6 .pb-8 .mb-4;
}
```

Labels and inputs should be uniform, so let's create components for those, pulling the utility classes out of the HTML. We also want the same padding between each input, so let's refactor that out as a component as well. Even though it is just a single utility class, this will make it easy to adjust the sizing to all form fields later.

```css
form.login-register-form {
    @apply .bg-white .shadow-md .rounded .px-8 pt-6 .pb-8 .mb-4;
    
    .input-group {
        @apply .pb-4;
    }
    
    label {
        @apply .block .text-grey-darker .text-sm .font-bold .mb-2;
    }
    
    input.form-input {
        @apply .shadow .appearance-none .border .rounded .w-full .py-2 .px-3 .text-grey-darker;
    }
}
```

One more thing that I noticed when looking at this form is that an input field can be invalid. Let's make these classes so that invalid fields on other forms will have the same look.

```css
form.login-register-form {
    @apply .bg-white .shadow-md .rounded .px-8 pt-6 .pb-8 .mb-4;
    
    .input-group {
        @apply .pb-4;
    }
    
    label {
        @apply .block .text-grey-darker .text-sm .font-bold .mb-2;
    }
    
    input.form-input {
        @apply .shadow .appearance-none .border .rounded .w-full .py-2 .px-3 .text-grey-darker;
    }
    
    input.invalid {
        @apply .border-red .mb-3;
    }
    
    p.warning-text {
        @apply .text-red .text-xs .italic;
    }
}
```

We have cleaned up the form quite a bit. We still have utility classes, but that is fine. They only exist in spots that are specific to this particular form. We don't want to over-think the components!

```html
<div class="container w-full max-w-xs mx-auto my-8">
    <form class="login-register-form">
        <div class="input-group">
            <label for="username">
                Username
            </label>
            <input class="form-input" id="username" type="text" placeholder="Username">
        </div>
        <div class="input-group">
            <label for="password">
                Password
            </label>
            <input class="form-input invalid" id="password" type="password" placeholder="******************">
            <p class="warning-text">Please choose a password.</p>
        </div>
        <div class="flex items-center justify-between">
            <button class="btn btn-primary" type="button">
                Sign In
            </button>
            <a href="#">
                Forgot Password?
            </a>
        </div>
    </form>
    <p class="text-center text-grey text-xs">
        ©2017 Acme Corp. All rights reserved.
    </p>
</div>
```

We can now easily create a registration form, and have it look similar to the sign in form.

```html
<div class="w-full max-w-xs mx-auto mt-8">
    <form class="login-register-form">
        <div class="input-group">
            <label for="username">Username</label>
            <input class="form-input" type="text" id="username" placeholder="Username">
        </div>
        <div class="input-group">
            <label for="email">Email</label>
            <input class="form-input" type="email" id="email" placeholder="email@email.com">
        </div>
        <div class="input-group">
            <label for="password">Password</label>
            <input class="form-input" type="password" id="password" placeholder="********">
        </div>
        <div class="input-group mb-6">
            <label for="confirm-password">Confirm Password</label>
            <input class="form-input" type="password" id="confirm-password" placeholder="********">
        </div>
        <div class="input-group text-center">
            <div class="btn btn-primary">Register</div>
        </div>
        <div class="text-center">
            <a href="">
                Already have an account?
            </a>
        </div>
    </form>
</div>
```

![Tailwind Login](/assets/images/login.png)
![Tailwind Register](/assets/images/tailwind-register.png)

## Conclusion

In closing, I hope that this article has made it clear how easy it is to create components out of the Tailwind utility classes, and how easy it is to read and modify these components. I personally like to build out these components using the utility classes in the HTML. Only when I start to see patterns of re-usability do I think it is a good idea to refactor the classes out into a single component. Using the @apply directive allows us to have small, concise CSS that is easy to modify.

