---
layout: post
title:      "Deplyoing your Sinatra project with Heroku"
date:       2020-04-16 23:08:42 -0400
permalink:  deplyoing_your_sinatra_project_with_heroku
---

One of the most satisfying parts of your Sinatra project is finally getting to make something that you can send your family and friends to, and --- what's more --- something they might even use! The first step to getting your Sinatra app on the web is to deploy it. The quickest way to do that, and the cheapest (can you say __FREE__?!) is to use Heroku. However, the process for deploying your code straigt from GitHub to Heroku is not so straightfroward. In Flatiron, we used Sinatra, ActiveRecord, and SQLite3 to develop our apps. Heroku, however, doesn't support SQLite3... that means you'll have to set up your app to run with PostgreSQL! Before you panic, don't worry. It's not as hard as it seems, and I'll be with you every step of the way (metaphorically speaking). Let's jump right in!

## 1. Set up a Heroku account
Simple enough: head to [Heroku](www.heroku.com) to set up an account. It's mostly free; since this is probably you're first webapp, you likely won't be seeing an overwhelming amount of traffic that requires lots of "dynos". For now, the free plan will work just fine.

## 2. Install PostgreSQL or Heroku CLI
Setting up PostgreSQL can be a bit of a burden. If you're on Linux or Mac, things seem to go pretty smoothly. If you're in the Linux Subsystem for Windows, there's a few extra steps to make this work.

### Install `postgresql`
In your bash prompt, type `sudo apt-get install postgresql`. This will do lots of fun stuff as it installs PosgreSQL in some file directory that is obscure and somewhat unfindable. 

### Install `libpq-dev`
You may get an error while doing a `bundle install` that this file doesn't exist. It's a dependency for `postgresql` to work. While you don't need it in your Gemfile, you will still need it in your Gemfile.lock. Make sure you install it before you go on!

## 3. Switch from SQLite3 to PostgreSQL
This is going to require a lot of changes to your files. If you haven't done your assessment yet, you may not want to mess around with this. If you still want to, I'd suggest making a new Github branch and working from there. Once everything is working properly, you can create a pull request to merge the branches together.

### Create a new Github branch
#### 1. In the terminal, go to your project directory
#### 2. Type in `git checkout -b [your-new-branch-name]`
#### 3. Push the branch to github using `git push origin [your-new-branch-name]`
#### 4. After you start making some of the changes below, you'll want to push them into your new branch. 
To do so for the first time, you'll need to do the usual `git add` then `git commit -m "Message"` and then use something like `git push --set-upstream origin [your-new-branch-name]`. This will create a new remote version of your branch. Think of it this way: you just created a new branch on your local computer, you added files, and you committed them as changes. Now, you need to push those changes into a new remote (i.e. probably GitHub) version. Don't worry; a warning will likely prompt you if you do something wrong.

As an additional note, always be very careful that you're working in the correct brach. You can check that by typing `git branch -a`. You'll see a lot of options there. The important thing is to make sure there is a little asterisk next to the branch you want to be working in. If you need to switch branches, type `git checkout [branch-name]`. If you're ever make a change on Github.com or on another computer, always make sure you use `git fetch` to pull in all those new changes. Most of these commands should be enough to get you through the rest of this, if you need them!

Now that you're in your new branch, it's time to change some files.

### Gemfile
PostgreSQL is your environment for deployment, but you still may want to use SQLite3 at this point since (a) it's what you're familiar with and (b) the Flatiron curriculum uses it. The first step towards doing this is creating two different "groups" in your Gemfile. One will be for development and one will be for production. The gem for PostgreSQL is called `pg`. So we'll add that to our `production` group and leave `sqlite3` in our `development` group.
```
source 'http://rubygems.org'

gem 'sinatra'
gem 'activerecord', '~> 4.2', '>= 4.2.6', :require => 'active_record'
gem 'sinatra-activerecord', :require => 'sinatra/activerecord'
gem 'rake'
gem 'require_all'
gem 'thin'
gem 'shotgun'
gem 'pry'
gem 'bcrypt'
gem 'tux'
gem 'redcarpet'
gem 'coderay'

group :test do
  gem 'rspec'
  gem 'capybara'
  gem 'rack-test'
  gem 'database_cleaner'
end

group :development do
 gem 'sqlite3'
 gem "tux"
end

group :production do
 gem 'pg'
end
```

### Gemfile.lock
Time to generate your `Gemfile.lock`. This will require you to type `bundle install` into your terminal. You may hit a few errors here; read them carefully. Typically, copy/pasting the error into Google will help you find the answer. If you can't figure it out, feel free to comment below and someone will be able to help you out!

### Environment.rb
Since we're working with two different kinds of database frameworks and two different groups, we'll also need need to add two separate configurations to your `environment.rb` file so that ActiveRecord knows which pathway to take in different scenarios. In our `development` configuration, we'll still use SQLite3 as our adapter for ActiveRecord. In our `production` configuration, we'll set up PostgreSQL.
```
require 'bundler/setup'
Bundler.require

configure :development do
 ENV['SINATRA_ENV'] ||= "development"
 require 'bundler/setup'
 
 Bundler.require(:default, ENV['SINATRA_ENV'])
  
 ActiveRecord::Base.establish_connection(
   :adapter => "sqlite3",
   :database => "db/#{ENV['SINATRA_ENV']}.sqlite"
  )
end

configure :production do
 db = URI.parse(ENV['DATABASE_URL'] || 'postgres:///localhost/mydb')

 ActiveRecord::Base.establish_connection(
   :adapter  => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
   :host     => db.host,
   :username => db.user,
   :password => db.password,
   :database => db.path[1..-1],
   :encoding => 'utf8'
 )
end

require './app/controllers/application_controller'
require_all 'app'
```

### Procfile
Don't be confused: you didn't need this file before, so you won't have it in your directory anywhere. We're going to create a new file in your root directory simply called `Procfile.` It should not have any file extensions and will contain this one line of code:
```
web: bundle exec rackup config.ru -p $PORT
```
## 5. Deploy on Heroku (but you're not done yet!)
At this point, you might be tempted to try to get everything to run on your local machine. If you're on WSL, you're in for a NIGHTMARE. Fortunately, Heroku will pick up some of the slack for you. It's worth attempting to deploy your app to Heroku just to see what errors you'll get. The quickest, most foolproof way to get your project running on Heroku is to simply connect it to your repo in Github. You can also use the Heroku CLI, but this can be cumbersome and has some unnecessary hurdles. I would suggest, to ease the burden, to simply follow the prompts on Herou's `Deploy` dashboard. As far as settings are concerned, you can skip the __Add to pipeline__ section. At the moment, this feature is probably overkill. Under __Deployment Method__ select __GitHub__ then connect your project repo. Once connected, you'll be given the option to __Automatically deploy__ or __Manually deploy__. I chose __Manual__ wh

## 5. Migrate your new databases and setup Heroku CLI
There are pretty detailed instructions for installing the Heroku CLI on Linux and Mac, however Windows users will be somewhat disappointed. The best command for a Windows user is to jump straight to the source: `curl https://cli-assets.heroku.com/install.sh | sh`. This will by-pass installing from their downloadable installer (which installed heroku into my Windows Powershell/Prompt, but not into my WSL bash), and the `sudo apt-get heroku` didn't get me any further. The `curl` command worked perfectly and let me run Heroku within my terminal without issue. From here, you'll want to start with `heroku apps` or `heroku open` to get to the log-in page. Once you've logged in, you'll be able to see your apps and your logs. You'll also be able to use the CLI to see any of your error logs, which is going to be a very important last step to getting things fully set up.

For now, we need to migrate our databases again! Remember, you may have migrated them back with SQLite, but now we need to do so with Heroku. The command will be `heroku rake db:migrate -a [your-app-name]`. You'll also want to seed your databases again, if you had made seeds.  `heroku rake db:seed -a [your-app-name]` should do the trick. If you get some errors here, make sure you look them up! I personally wasn't able to do this part until after I changed my gem version for `pg` to `~> 0.20`. It is an older version, but seems to have the most support alongside ActiveRecord. More about this in the __Troubleshooting__ section below.

## 6. Check your website!
Okay, so it's time to see what happens. After you've finished running your migrations and seeds, as well as adding, committing, and pushing changes to GitHub, go ahead and __deploy__ one more time from Heroku's __Deploy__ dashboard. At this point, your app should be up and running! Yay, you did! If it's not, that's okay. Check out the __Troubleshooting__ section below for how to find out what's going wrong, as well as one solution that got me up and running after spending some time tearing my hair out.

![have you tried turning it off and on again?](https://i.redd.it/oqjw9866azez.gif)
## Troubleshooting
If your app didn't launch, that's okay. Debugging is a part of this whole darn coding process anyway. Get used to being frustrated! The first thing you'll need to do is check out your error logs to get a handle on things. For this, head to your terminal and type `heroku logs -a [your-app-name]`. This is going to probably give you a LOT of info. The items you're looking for will have some kind of error code. For me, I was looking for the most human-readable messages. I tried to address those first, since I figured they'd be the easiest to figure out. Also, much of the not-really-human-readable code is just tracebacks (i.e. the order and commands that were executed before they failed). I've covered a lot of the errors I ran into along the way up above, but I want to talk about one that is a bit odd, and how exactly to overcome it.

### "Specified 'postgresql' for database adapter, but the gem is not loaded'
This one was pretty annoying to fix. I was sure I had all my adapters properly set up. I took to Google and found a good question on StackOverflow abot this error, and the anwer suggested adding a version number to the postgresql gem in my Gemfile, like this: `gem 'pg', '~> 0.20'`. That was a quick fix for me, and it worked like a charm. Unfortunately, when you're running some commands like `db:migrate` and `db:seed` you might see some deprecation warnings. It's a small price to pay for the easiest solution.

## Conclusion
I hope by now your app is up and running! If it isn't and you still need some help, don't be afraid to shoot me a message on [Twitter](http://twitter.com/beinglogica), and I'll try my best to help you out. If you're a Flatiron student, you can also find me on the Learn Slack channel. Happy coding!

