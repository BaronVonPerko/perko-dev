---
date: 2018-02-14
title: "99.5 KISS Sucks! San Antonio - Laravel Application"
image: kiss-sucks.jpg
categories: General
tags: laravel,web development
---

## KISS Weekend Project

San Antonio has a lack of rock stations to listen to on the radio. The only one that exists in the area is 99.5 KISS. Over the years living here, I have noticed that the same songs are always playing, and always by the same artists. I can't tell you how many times I have heard Metallica's Enter Sandman. The artists and songs they play are not bad, they are just over played.

One weekend in January, I set out to build a [small Laravel app](https://kiss-sucks.com/) to analyze the songs that KISS plays. Luckily, the [KISS website](http://www.kissrocks.com/) has a little widget showing what is currently playing. Inspecting the code on the site revealed that is uses data from a REST API, that is fully open to the public to use, no CORS or anything protecting it.

Building a service to fetch data from this API was super easy to use, and the [source code](https://github.com/BaronVonPerko/kiss-sucks) for this project can be found on my GitHub account. Next I wanted to analyze the release dates of the songs that are played on the site, which is where [Discogs](http://www.discogs.com/) comes into play. Discogs has an API that can be used to get information on a given song, including the release date. I still have some work to do on analyzing the dates, as some of the dates my app has retrieved show release dates very recent, as some of the songs have been remastered and re-released.

## More Analytics

Currently, the KISS Sucks app shows the most recently played songs and the most played artists. I recently posted the site on the [99.5 Kiss Sucks San Antonio Facebook page](https://www.facebook.com/995KISSSUXX/?ref=br_rs) as a comment to a post and had great feedback from the community. Some feedback gave me ideas on more metrics to show on the page, and I have an idea of making a searchable section where users can see how often a particular song or artist was played over the course of a week, month, quarter, etc.

As for styling, the site was put together in a short period of time, and styling was more of an after thought. I plan to completely redesign the site from the ground up, and possibly pull in posts from the community Facebook page. This project is completely open-source, so if anyone has any ideas or a design they would like to implement, feel free to create a pull request!