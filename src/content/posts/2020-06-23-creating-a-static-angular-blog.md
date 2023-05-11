---
date: 2020-06-23
title: Creating a Static Angular Blog
image: angular-shield.png
categories: angular
tags: static,angular,aws,post-mortem
---
If you hadn't noticed, I recently launched my new blog site.  My site had been on WordPress for many years, and I wanted to try something new.  I wanted to go static, with Angular being my weapon of choice, hosted on an AWS S3 bucket.  I also really like [Tailwind](https://tailwindcss.com/), so using [TailwindUI](https://tailwindui.com/) made it easy to design my site.

## But... Why?

Static sites are super fast because they are "serverless" (there's still a server, just not one that the developer has to maintain).  There are no requests to an API, or any calls to a database.

There are a lot of options of serving static sites for free, such as with [Netlify](https://www.netlify.com/).  I went with AWS because I work with AWS during my full-time job, and am working to become certified.  This was an excuse for extra practice on the AWS cloud.

Then there was the choice to go with [Angular](https://angular.io).  I could have used a static site generator like [Jigsaw](https://jigsaw.tighten.co/), which I have used in the past for a client's website.  However, I wanted a challenge of a side-project to help me really understand everything that goes into a blog (spoiler alert: it's not just about serving content!).

## Building with Angular

I really ♥ Angular.  It may seem quite overwhelming to a new developer, as there are just tons of features baked in (it's considered a framework, unlike React which is a small UI library).  Typescript is a joy to work with, especially if you come from a type-safe language such as C#.  Having routing baked into a new project makes it so easy to just get right into coding your app without needing to worry about configuration.

My main goal was to serve simple markdown files for the content.  Every post and content page on this site is written in markdown.  [This website is completely open-source, so check it out!](https://github.com/BaronVonPerko/StaticAngularBlog)  I use a simple package called [ngx-markdown](https://www.npmjs.com/package/ngx-markdown) to parse the markdown within Angular.  

Here is an example of how this works.  First, I have a route for a single post:

```javascript
const appRoutes: Routes = [
//...
  { path: 'blog/post/:title', component: PostComponent },
//...
];
```

When a user navigates to a blog post, such as */blog/post/2020-06-23-creating-a-static-angular-blog*, we grab the title and pass it to the **PostComponent**.  The post component's job is to get the post data from the **PostService** and render the content.  Here is what the **PostComponent** does on initialization:

```javascript
ngOnInit() {
    this.route.params.subscribe(params => {
      this.postService.getPostDetails(params.title)
        .subscribe(post => this.post = post);

      // ...
    });
  }
```

This code example also shows something else that I love in Angular, and that is the use of [RxJS](https://rxjs-dev.firebaseapp.com/) (reactive javascript).  RxJS simplifies working with asynchronous javascript, and gets rid of the promise callback hell issue.  Next, the **PostService** simply gets the post data from a file in S3 which contains all of the post content and metadata (title, image, tags, category, etc).  Here is the very simple code that accomplishes this (again, a simple look at RxJS):

```javascript
getPostDetails(link: string): Observable<Post> {
    return new Observable(subscriber => {
      subscriber.next(Posts.filter(post => post.link === link)[0]);
    });
  }
```

And that's pretty much the bulk of rendering a markdown file as a blog post!  I have several scripts in the */scripts* directory, such as **createNewPost.js** which are node scripts for simplifying tasks.  I can write a new post by doing this:

```bash
node ./scripts/createNewPost my-post
```

And it will generate the file with metadata and the current date.

## Other Features

What about search?  What about sitemaps and SEO?  What about the menus?  These are all little features that you don't really have to think about when working with WordPress.  This all has to be taken into consideration.  

I had to write a script that builds **json** files in order for my search feature to quickly parse keywords, tags, titles, and more from all of the posts to quickly return a result to the user.

Scripts are also written to generate sitemaps.  These have to be run each time a new post or page is created.  

## Would I Do It Again?

The short answer is **no**.  This was a great exercise, and I still have lots to do (such as auto sizing images, or setting up Github actions to automatically update S3).  Building a custom blog was a lot of fun and I have something completely custom for myself, but the time cost was quite huge.  Tools such as WordPress really make it easy to just start writing your posts, and you can easily change the look later.  Plugins make SEO and many other tasks a breeze.  Sharing on social media means that you have to make sure that the featured images are setup correctly in the HTML for the parsers to find.

Don't get me wrong, I love my new site.  Writing in markdown is quite nice, and I don't have to worry about complex Gutenberg blocks.  However, this is not something that I could hand over to most clients who are not going to have experience writing in markdown.