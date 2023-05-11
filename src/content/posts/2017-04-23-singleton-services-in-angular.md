---
date: 2017-04-23
title: Singleton Services in Angular
image: angular-shield.png
categories: angular
tags: angular,components,singleton,services
---
Angular uses dependency injection to new up objects when a component is generated.  This feature can also be used to re-use a service that is already instantiated.  This can help with performance if, for instance, the service being injected is used to fetch data from a server.  If this service is used in multiple components, we don't need to call the server for each component, we only want to do it once, and persist the data to all of the components.

Angular's **providers** attribute allows us to do this.  It also allows us to use a service as a singleton across components, but allow a specific component (and all of its children) to have its own instance of the service.

## Project Setup

I have created a project to demonstrate this.  [The code can be found here.](https://github.com/BaronVonPerko/ChrisPerko.NET-Demos/tree/master/SingletonServiceExample)

In this project, we have a service for storing a name.  It can be found in **app/services/name.service.ts**.  It comes with a default name (I used 'Chris'), and will be used by our components.  In order to use it, we need to provide it somewhere.  Since we will want singletons in our app, let's just put it at the very top of the component tree, in **app/app.module.ts**.  You will find the **providers** attribute here, providing this service to the rest of the app.  It is not instantiated at this time.

## Components Using the Singleton

Let's create a component that will use the service as a singleton.  This can be found in the example code at **app/components/shared-singleton/shared-singleton.component.ts**.  You will notice that the constructor takes the **NameService**, and is using dependency injection.  The first time one of these components is added to the page, the **NameService** will be instantiated.  This **shared-singleton** component has very little code.  It is just here to show that we can see and edit the name from the service.

We can add multiple of these to the page and see how they behave.  You can see that we have added two of them in **app/app.component.html**.  Viewing this in the browser, you can see that editing the name in either of these two components will update the other.  This is proof that the two components are utilizing the same instance of the service, our singleton.

## I Don't Want to Share!

I want to re-use this amazing service in another component, but I don't want it to be linked anywhere else.  We should able to change the name somewhere on the app, but not have it update the other components.  This is where we can utilize the **providers** attribute again, to create a new instance of the service, and have it separate from the singleton we already were using.

The **not-shared** components (**app/components/not-shared/not-shared.component.ts**) is essentially the *same* component as our **shared-singleton** component.  The only difference here, is that we are adding the **providers** attribute, and giving it our **NameService**.

Now that we are providing the service at this component level, the dependency injection in the constructor of our **not-shared** component will create a new instance of the **NameService**.

We've added the **not-shared** component into the app along side the **shared-singleton** components.  Editing the name in one of these **not-shared** components will only update the data within that component.  The others have no knowledge of the service being used here.

## Providers Are Amazing

In short, the **providers** attribute allows you to quickly and easily manage what components get what services, and when they should be instantiated.  Remember, any child components of a component or module with a provider given, will have access to the service if injected into the constructor.

Happy coding!