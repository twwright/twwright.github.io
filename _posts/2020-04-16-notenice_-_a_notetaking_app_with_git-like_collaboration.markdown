---
layout: post
title:      "NoteNice - a notetaking app with git-like collaboration"
date:       2020-04-17 03:01:38 +0000
permalink:  notenice_-_a_notetaking_app_with_git-like_collaboration
---

## The concept
As I was starting at Flatiron, I became really close friends with a few people in our cohort. One of the discussions we frequently had was how people were taking and keeping notes. Everyone was using something different, and it was one thing that we have always been unable to really collaborate on. Some of us had more free time then others, and so some of us would have really complex and complete notes while others would barely have free time to do the lessons let alone take notes!  When the Sinatra module started, we really wanted to start sharing notes. The problem was that there were no easy solutions out there for this. We could share Googe Docs, but these really lacked some of the things we really wanted in a collaborative tool. For most of us, the ability to use Markdown was a huge __MUST__. There are some notable (pun intended) notetaking apps out there, but a lot of the ones that really do exactly what we wanted were not really notetaking apps at all --- they were coding repos like GitHub or documentation apps like GitBook.

So the goal was simple: a convenient, easy, clean notetaking app that could be used collaboratively (or not). The features we were insistent upon were:
1. It must support Markdown for formatting
2. It must have Git-like versioning and collaboration features, like forking/pushing/pulling
3. It must be simple to use
4. It must be free
With those things in mind, I decided to tackle a first-generation product for my Sinatra project: __NoteNice__. What we have today is by no way a finished product. There are many feature additions that remain, and there are plans for how to implement a lot of them. As someone who tends to lean a bit more towards the back-end, a lot of those features are really tempting to tackle this early on, and I frequently had to stop myself from trying to solve all the problems at once.

What I have settled on is a minimum viable product --- something that is, in essence, a proof-of-concept for what I would like to see __NoteNice__ become. It satisfies the project requirements for Flatiron School's Sinatra module. However, I would love to continue development on it once I have more tools in my toolkit. I imagine there are many things left to learn in Rails, JavaScript, and more that my ambitious project could greatly benefit from. I am proud of the progress so far, but I am also excited for building out the rest of its potential as I continue to learn.

## Staying atomic and organized
When I first started writing __NoteNice__, I really, really, _really_ wanted to do everything all at once. I'd start writing the `users/new` action, then I'd skip over to the `notes/new` action, then I'd write try to write the views, then I'd jump over to the migrations, then I'd come back and do something else that I had thought of while adding another feature I wanted while trying to make the sign in/sign up a dynamic part of the view and adding pull requests and... needless to say, I was easily distracted by each thing I wanted to accomplish. I realized pretty quickly that I'd gotten to a place where I was overwhelmed and losing track of what I had done and what needed to be done, as well as a way to navigate those obstacles systematically.

Once I took a step back, I realized a much better approach would be to plot out a path. I took some lessons from the idea of agile development, and I made a list of things I needed to do in a kanban-style board. I'd then tackle each piece in a sprint, accomplishing one task, then taking a brief break. This allowed me to never feel overwhelmed by doing everything all at once. It was a huge relief to do things this way, and it was the first piece of a puzzle that allowed me to design something that was always working.

The second piece, of course, was atomic commits with consistent commit messages. Peter Hutterer, a senior developer at RedHat, wrote an [awesome blog post](http://who-t.blogspot.com/2009/12/on-commit-messages.html) on commit messages back in 2009. It has since been stolen and quoted across the internet. I've taken inspiration from that article, especially from this quote:
> __Any software project is a collaborative project.__ It has at least two developers, the original developer and the original developer a few weeks or months later.

It's so easy to lose your place in a project or a task if you don't have some sort of way to keep track of what you've been doing. Between using kanban-based sprints and writing commit messages, it was easy to see what had been finished and what still needed to be accomplished.

As a bonus, this made debugging tremendously easier because I had "checkpoints" where things were working. If something stopped working, I could track what had changed and how it was affecting the app from working. These checkpoints made the entire process easier, and I would definitely recommend a kanban approach to others who are single-handedly designing something. 

## Trouble Spots
### Resetting my database
When trying to reset my database, I kept running into an error which said `“ActiveRecord::AdapterNotSpecified: ‘development’ database is not configured. Available: []”` My original workaround to solve this was to delete the `development.sqlite` file and run `rake db:drop` then `rake db:migrate` to get the databases out then back. However, I discovered after a bit of searching the proper way to allow you to run something like `rake db:reset` to reset your database from scratch.  First, you need to set the adapter in a `.yml` file. To do this, add a file to your `config` folder called `database.yml`. In this file, add the following lines:
```ruby
development:
  adapter: sqlite3
  database: development
```
This should immediately allow you to run all the rake commands releted to resetting the database in development. I am honestly not an expert at this, so it is definitely something I need to learn more about, but this seemed to do the trick and I never struggled with it again.

### CSS
CSS is something with which I am not very familiar. While I dabbled a lot with HTML as a kid, I mostly only did CSS in-line. The idea of designing the front-end of __NoteNice__ was absolutely __daunting__. When I first began, I almost felt like I didn't know where to start with styling. That led me to look into some frameworks, like Bootstrap and Tailwind. I decided that, given the time constraints of the project, I wouldn't spend two or three days learning either of those (it's something I can do over a curriculum break, for example). Instead, I decided to use a little styling system called [WaterCSS](https://watercss.netlify.app). WaterCSS let me just import a single stylesheet into my `layout.erb` that gave me tons of functionality and nice styling out of the box.

From here, I added a nav bar, a footer, and some other styling pieces here and there. Overall, much of the styling is thanks to WaterCSS, and I'm very appreciative for their project. I also did feel like I learned quite a bit while trying to custom-make some modifications to their very clean and elevant CSS. Overall, this is definitely a growth area for me, but I'm decently proud of the way things look.

### Markdown implementation and seed data
It turns out implementing a Markdown translator into your app is surprisingly difficult using Sinatra and Ruby on Rails. I did a lot of research on it, and I found a few solutions. I ended up implementing a custom-baked usage of two gems, called `coderay` and `redcarpet`. Redcarpet is a gem for doing some Markdown parsing from HTML input. The problem is that I really needed something that would support code snippets, and Redcarpet doesn't do a great job of that. Fortunately, I stumbled upon CodeRay, which was designed for this exact thing. Putting the two of them together allows my app to interpret and display markdown from `params` data! Yay! That said, this leads to two major hiccups.

First, it is not without error. Some input is not successful in CodeRay. I still haven't pinpointed the exact combinations of input that leds to the halting, but something about using `&&` really freezes things up. It is definitely a bug that needs to be fixed, but overall the system works decently well.

Second, seed data has been pretty difficult to implement. Part of this is definitely my own ambition to want to seed the database with big, well-written notes covering highly technical topics. In the end, I had to settle on using some simpler seed data to get things started. Luckily, since my Sinatra app is deployed live on Heroku, there's plenty of chances for people to go add their own data __right now__!

### Deploying to Heroku
I actually have an entire blog post written about this. Deploying to Heroku took quite a bit of time; I vastly underestimated how easy it using the Linux Subsystem on Windows would be with PostgreSQL and the Heroku CLI. That said, I am glad I spent the time to learn it. It really served to enhance my understanding of how `Gemfile` and `bundler` handle development groups. I also learned about how to set up different adapters for ActiveRecord depending on the group. I was also able to set up the Heroku CLI, and I learned how to run database commands from within there, as well as debug running dynos using activity logs. Overall, it was a tremendously rewarding challenge, and I'm proud to say the app is currently available for use at [Notenice.xyz](www.notenice.xyz). 
 
## Conclusion
I can't believe how few steps it really takes to go from coding in pure Ruby to designing a fully-functioning web app. Of course, there's been tons of content to learn in those steps --- SQL, ORMs, ActiveRecord, and much more. It's exhilirating to finally produce something that I could actually use on a daily basis if I wanted to keep notes for myself on the web --- I could literally stop using Google Keep! I feel extremely accomplished. I'm also really excited about the prospect of being able to write web apps that are utilities I actually would be glad to use; knowing at any time I can whip up a project management app, a heartrate tracker, a trip planner, a public calendar, a weightlifting journal, or anything else I can think of is really, really, __really__ cool. Sinatra has been awesome, now onwards and upwards to Rails!

