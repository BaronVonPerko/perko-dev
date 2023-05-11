---
date: 2019-03-16
title: Creating an Archive Page for a Custom Post Type in OxygenBuilder
image: oxygenbuilder.png
categories: WordPress
tags: archive,cpt,custom post type,oxygen,wordpress
---
I've been a real fan of [OxygenBuilder](https://oxygenbuilder.com/) since version 2 was released last year. Today, I want to show how to create an Archive page for a Custom Post Type using OxygenBuilder and the free [CPT UI plugin](https://wordpress.org/plugins/custom-post-type-ui/) for WordPress.

The problem I ran into while building a site for a friend of mine, was that I couldn't find any information on how to build an archive page for a custom post type. In Oxygen, there is a way to create a template for an archive, but I couldn't figure out how to make it actually work without writing custom PHP code. Here's the solution:

First, create a new custom post type using the CPT UI plugin like you would normally do. Next, you want to find these settings on your custom post type:

![CPTUI Settings](/assets/images/cptui-settings.png)

Set the dropdown to **True**, and create a slug. For instance, if the custom post type is for paintings for an art gallery, we could set it to **paintings**. Optional: In your WordPress menu, simply create a custom link with **/paintings** being your url.

![CPTUI Slug](/assets/images/cptui-slug.png)

The last step is to actually build your archive design in Oxygen. Open up the Oxygen templates page, and create a new template for your archive. Simply set the template type to an Archive, and target your custom post type.

![Oxygen Archive Settings](/assets/images/oxygen-archive.png)

That's all you need to do! Now just navigate to the slug you specified on your custom post type (in this case **/paintings**), and you will now see your Oxygen design! You can now use Easy Posts to easily loop over the posts within this custom post type!

