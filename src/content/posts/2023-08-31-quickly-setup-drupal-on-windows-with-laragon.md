---
date: 2023-08-31
title: Quickly Setup Drupal on Windows with Laragon
image: drupal.jpg
avatar: drupal-logo.webp
categories: drupal
tags: drupal,drush
---

I highly recommend using [Laragon](https://laragon.org/index.html) 
for local PHP development on Windows.  I've used it for WordPress and 
Laravel development in the past, and it's just too easy
to set up and get going to pass it up.

All the commands within this tutorial will need to be run within Laragon's
`Cmder` app.  This command line tool works within Laragon, which means you have
access to PHP and Composer out of the box!

Laragon also comes packaged with HeidiSQL, a very easy to use MySQL management tool.  We
will need to create a user for Drupal to use.  Click **Tools** > **User manager** to
open the user manager window.  Add a new user with global privileges.  I like to use
`drupal` for the username, and `drupal` for the password (this will make a step
later on much quicker and easier).

Use `composer` to create your new project:

```bash
composer create-project drupal/recommended-project my-site-name
```

This will create a new Drupal site in the directory `my-site-name`.  Make sure you 
reload Laragon, so it picks up the changes, and it will automatically set your 
hosts file so `my-site-name.test/` works locally.

The website installer will appear in your browser, and you are free to use this
to set up your site.  However, if you want a quicker approach, I recommend using
`drush`.

```bash
cd my-site-name
composer require drush/drush
```

Then, we can use `drush` to set up our project.  Follow the wizard, which
will ask you questions like the database username and password.  The defaults
to both are `drupal`, which is why I recommend setting up a username with those
credentials to make this step quick.

```bash
php vendor/bin/drush site:install
```

> You can alternatively use `si` instead of `site:install` as a shorthand.

The `drush` CLI will give you a default password for admin.  However, I 
don't care about having a super secure password when working locally, so
I like to change it using `drush`.

```bash
php vendor/bin/drush user:password admin password
```

This will set the password for the `admin` user to simply `password`.

> You can alternatively use `upwd` instead of `user:password`

That's all you need for a fresh, new Drupal installation on your local
Windows machine!  Cheers 🍻
