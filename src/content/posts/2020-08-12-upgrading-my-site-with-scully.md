---
date: 2020-08-12
title: Upgrading My Site With Scully
image: scully-landing.png
categories: Front-End Development
tags: angular,scully,static,aws
---

[In my previous post](/blog/post/2020-06-23-creating-a-static-angular-blog), I talked about creating a static 
site with Angular for my personal blog/website.  Now in reality, the site at that time wasn't truly "static".
The site was actually just a single-page application (SPA).  When a user visits my site, no matter what route, they
are redirected to **/index.html**, which loads the full Angular project, and Angular then handles the route
and displays the content (for example, a blog post).  This is fine for regular users, and allows for fast navigation
through the site, but it doesn't work well for bots.

## Scully

This is where [Scully](https://scully.io) comes in to play.  Scully takes any Angular application, and makes it static.
What this means for my site is for example, when you visit *https://chrisperko.net/blog*, instead of Angular
displaying the **BlogArchive** component, which fetches the latest posts on the fly, Scully creates a new page at
*https://chrisperko.net/blog/index.html*.  This single html file has all of the code (css and all) needed to display
the latest posts.  You can even turn off javascript and refresh the page, and get the same results.

The best part is that Angular is still there.  Click on the **Load More** button, and Angular will handle it.  We 
now get the best of both worlds.  To a user, everything still performs the same as a SPA, but to a web scraper, it
works like a standard server-rendered website.

## Social Media Meta Tags

Before adding Scully, I could not share a post from my new site to Facebook or Twitter and have it render
correctly on those platforms.  Angular does have a [Meta service](https://angular.io/api/platform-browser/Meta#meta)
for dynamically adding meta tags to your HTML.  However, most web scrapers are not using javascript, and therefore
will not have the meta tags loaded when it reads the HTML on the site.

Scully, however, will fully render each route before it creates the static files for each page.  This made it super
easy to set the correct meta tags ahead of time for social media scrapers.

## Simple Installation

This all sounds great, but how hard is it to install and setup?  For my site, I had built it prior to even deciding
to use Scully.  There wasn't anything I needed to do in the planning and development of my site to make sure
that it was going to work, it just worked!

To install Scully, you simply just add the following to your Angular workspace:

```bash
ng add @scullyio/init
```

Scully handles the rest, updating the main app module and adding a config file, and a few other magical things
in the background.  At this point, for most routes, you are done!  You can continue reading the 
[documentation](https://scully.io/docs/learn/getting-started/building/) to see how to easily build the project,
but I wanted to cover one more thing here.

## Dynamic Routes

With any SPA, you will have **dynamic routes**.  As an example, let's pretend our site has a route for each
Pokemon.  Each Pokemon has a unique ID.  Let's say a Pokemon has an ID of **1**.  The route for this Pokemon
would be *https://mysite.com/pokemon/1*.  Instead of writing a route for each Pokemon, we will use a 
dynamic route inside Angular which looks like this:

```typescript
const appRoutes: Routes = [
    { path: 'pokemon/:id', component: PokemonComponent },
];
```

Scully will give you a warning about this route, as it doesn't know how to go and look at these pages.  You can
teach Scully with a *plugin*.  You can think of these plugins as simply javascript code.  In this case, let's say
we have a *JSON* file that lists all the Pokemon data, our very own Pokedex.

In our **scully.mysite.config.ts** file (which is created by Scully automatically), we can build a plugin to 
build an array of routes that we want Scully to know about:

```typescript
import {HandledRoute, registerPlugin, RouteTypes, ScullyConfig} from '@scullyio/scully';
import {Pokemon} from './src/data/pokedex.json';

function pokemonPlugin(route: string, config = {}): Promise<HandledRoute[]> {
  const routes = [];

  Pokemon.forEach(pokemon => {
    routes.push({route: `/pokemon/${pokemon.id}`, type: RouteTypes.json});
  })

  return Promise.resolve(routes);
}

registerPlugin('router', 'pokemon', pokemonPlugin);
```

Here we have simply looped through all of our Pokemon and created a route which contains the ID for each one.
We also register the plugin with the *registerPlugin* function provided by Scully.  We will use the second
parameter on this line in our configuration in the same file.  Here is the configuration that Scully created
for us:

```typescript
export const config: ScullyConfig = {
  projectRoot: "./src",
  projectName: "PokemonSite",
  outDir: './dist/static',
  routes: {}
};
```

Let's just update the *routes* section so Scully knows about our Pokemon routes:

```typescript
export const config: ScullyConfig = {
  projectRoot: "./src",
  projectName: "PokemonSite",
  outDir: './dist/static',
  routes: {
    '/pokemon/:id': {
      type: 'pokemon',
    },}
};
```

Here you can see we used the *pokemon* plugin we created above as our route type.  Now, when you run the Scully
build command, it will render every pokemon page and create a static file.

> For example, /pokemon/1/index.html, /pokemon/2/index.html, etc.
