---
layout: post
title:      "Overlooked Concepts for Your First CLI Assessment"
date:       2020-01-26 00:16:55 -0500
permalink:  overlooked_concepts_for_your_first_cli_assessment
---


Today I want to talk about my first CLI project for Flatiron School: [Foodexplorer](http://cli-project.twwright.repl.co).  I want to cover a few mistakes you might make with your first Ruby project by talking about a few of mine and how I fixed them. On the way, we'll also cover some fundamental things to know about executing Ruby, and some questions that came up in my very first code assessment with Flatiron School!

You can familiarize yourself with my project by following the link, checking out the code, or running it on repl.it. However, the advice below is mostly general with examples drawn from my own refactors and codebase for Foodexplorer. While it may be beneficial to check out my code, Ive tried to provide snippets as often as possible to help contextualize things. To put it briefly: Foodexplorer is a command line tool that lets the user navigate through cabinets, create random grocery products, and find out nutritional information about those products. It's a command line version of exploring your kitchen as a kid and finding random products, with the added adult twist of knowing the nutrition data of those items. There are three classes, `CLI`, `Product`, and `Cabinet`. Their functions are what you'd imagine in real life: command-line interface handles input/output, products have nutritional data and belong to cabinets, cabinets have products inside of them (although some are empty!). Simple, right? Right!

This simple project can teach us a lot about good object-oriented design principles and some fundamental programming concepts. Okay, let's dig in!

*For more like this, follow me on [dev.to](http://dev.to/twiddlewakka)!*

### Single Responsibility Principle
The single responsiblity principle says that every class, module, or method should be responsible for **one** thing---in other words, an object should be responsible for a single unit of work. What did this look like in Foodexplorer? It is the responsibility of the `CLI` class to handle user input/output. It is the responsibility of the `Product` class to create and report itself. It is the job of the `Cabinet` class to keep track of its associated products. My mistake early on was thinking that the `Product` class should report its own status, and while this is *sort of true* its truly a violation of this principle of responsibility. The `CLI` class handles input/output. It's not my `Product` class's responsibility to interface with the user; it's the responsibiltiy of the command line *interface*. Understanding this was a huge revelation when it came to the architecture of my application and how methods should be distributed between classes. It led to a huge minimization in my `Product` and `Cabinet` class since their responsibilities were, on the whole, limited. 

### Separation of Concerns
Separating concerns focusses on the modularity and, in turn, encapsulation. Being modular means that a snippet of code can execute one aspect of a desired functionality. The `CLI` class of Foodexplorer has four primary method types:

 1. **Splash methods** are responsible for introducing a menu or control flow. Their only purpose is to display once when changing menus or entering the program. They are, by design, not meant to be called repeatedly.
 2. **Menu methods** are responsible for giving menu options. Their purpose is to manage a user's flow through the interface by using user input to make navigation decisions.
 3. **Query methods** are responsible for asking specialized questions to the user. They are like specialized menus, focussing primarily on using user input to make item-specific selections.
 4. **Display** or **list methods** are responsible for handing over output to the user based on their selections and location within the interface.

Categorizing what *kind* of method I wanted, besides DRY-ing out my code (see below), also made it extraordinarily modular. Methods had everything they needed to execute their role, and that role could be quickly pointed by throughout the program. It also meant I could spot when there was more than one way to display or select the same thing and refactor appropriately, leading to an object architecture that was entirely plug-and-play.

The second characteristic of separating concerns related to encapsulating information inside of a piece of code. Another way to think of this is as a way of *information hiding* . In our heirarchy, the `Product` and `Cabinet` class know about each other by their very nature, but they aren't *concerned* with each other. In my original code, the `Cabinet` class would make its own `Product` instances; the new Foodexplorer encapsulates this feature by moving the `#create_new` to the Product class, and calling `Product#create_new` directly from the CLI. The `Cabinet` knows about its associated `Product` instances only by a has_many relationship; otherwise, the details of the `Product` class are altogether *hidden*---the `Cabinet` class never *steps into* the `Product` class and vice-versa. 

Treating the program as if the `CLI` class is a "front-end" and the `Product`/`Cabinet` classes are the "back-end" led to both a modular and a fully encapsulated program. This architecture will also bode well for us as we move into the principle of Model-View-Controller.


### Open/Closed Principle
Speaking of the `#create_new` method, let's talk about the open/closed principle of object-oriented design! The premise is simple: a system should be open for extension, but closed to modification. In other words, we should be able to extend the abilities and feature-sets of a program without having to change anything we've already established. Obviously, there will always be moments where refactoring to include features will be necessary, but the idea is that in an object's class we want to be able to extend the ability to instantiate new objects from diverse resources. Consider the difference between (a) writing a `API.call` into an object's `initialize` method versus (b) writng a `self.create_from_api` method that pushes an attribute hash into the object's `initialize` method. If we wanted to include an alternate API, add a scraper, or include user-generated objects, we would have to rewrite the object's `initialize` altogether. However, in (B) we can simply add a new method, `self.create_from_whatever`that does the grunt work before shoveling the attributes into the `initialize`. Our ability to extend our creation here would be endless! That's the basic premise of the open/closed principle: we can extend abilities without altering old ones.

### DRY Code
The nightmare of a codebase's architecture is repetiveness. It's certainly the *easiest* code smell to notice, but implementing methods to DRY out your code can sometimes be daunting. DRY stands for *don't repeat yourself*. In the first iteration of Foodexplorer, I had this line show up a lot:
```ruby
	else
		puts "Hmm, I didn't quite catch that. Let's try again."
		main_menu
	end
```
It took me far too long to realize that I could simply encapsulate repetition into its own method, `#oops` and call that method. The refactored version looked more like this:
```ruby
	else
		oops
		main_menu
	end
```
After doing that, I realized I could have some fun with it. Who wants to see the same error message over and over and over again? I wrote this into the `#oops` method:
```ruby
def oops
	random = rand(0..5)
	if random == 1
		puts "\nOops.. I'm not sure I understood what you were trying to do."
	elsif random == 2
		puts "\nHmm.. looks like you're having a little trouble."
	elsif random == 3
		puts "\nOh no.. I don't think you entered a valid option."
	elsif random == 4
		puts "\nDarn.. you lost me. Let's try that again?"
	else
		puts "\nWhoops.. didn't catch that. Try again?"
	end
end
```
Now, everytime we see a mistaken entry, we get a different message. This made the application feel more dynamic, as if it was really paying attention. Since I had simply put `oops` into all the other methods, I could change one spot and watch the entire application become dynamically more interesting.

### Functional vs Object-Oriented
With the above design principles in mind, let's talk about a major failure of Foodexplorer's first iteration: it was more functional than objective. There's nothing *inherently* wrong with that, if you're writing in a language like C++ or Haskell. But if you're in Ruby or Python, you'll want to leave that at the door! It's not that these languages *can't* support functional programming, but part of the magic of Python or Ruby is that *everything is an object*. Understanding how to manipulate those objects is absolutely pivotal for a successful object-oriented codebase, although merits for one versus the other are somewhat arguable.

So what did this difference look like in Foodexplorer? Here's [a diff](https://github.com/twwright/foodexplorer/commit/0e60a9cef1c9afcd1fad4822691a16fb3a86cbaa) from the a refactor that fixed some of the issues above. 

![diff from fe1 vs fe2](https://i.imgur.com/i6fVVg4.png)

Specifically, I want to pay attention to changes to the `Cabinet#display_cabinet` method, where I've moved from a procedural practice of passing input/selections as arguments to an object-oriented one, where I'm using properties of objects to make things work. First, to note, is that this method is inside of the `CLI` class. Why? It handles input/output, so it belongs in the class whose responsibility it is to handle input/output. Second, this method has one distinct purpose: it displays the cabinet information. Finally, let's talk about some functional/object-oriented changes: you'll notice the new method `#display_cabinet` drops the `(cabinet_name)` parameter. Inside of the method, we also see that the enumerator no longer uses a `Product` class method and a matching conditional to ensure it prints the right names. Although line 91 and 92 have some object-oriented features, this method is still ultimately manipulating the argument passed into the `(cabinet_name)` parameter. Notice `product.cabinet = cabinet_name` and later calling `cabinet_contents_query` with the `(cabinet_name)` again passed to another method. Line 91 shows the new method which accomplishes the exact same task using an attr `selected_cabinet` from the `CLI` class to log which cabinet or product is selected, rather than using a parameter. This meant the entire method could re-expressed in a single line, calling the `#products` reader method on the object instance assigned to `selected_cabinet` and enumerating with the same `each.with_index(1)`. The method finishes the same as before, but drops the `(cabinet_name)` again from the call to `#cabinet_contents_query`.


### Shebang! Hashpling!
The shebang is a special character sequence in a script file that specifies which interpreter to use. The shebang is always on the first line of the file, and in Ruby is composed of the characters `#!` followed by the path to the interpreter program. Including `env` means you do not have to know the absolute path to the Ruby interpreter, because the script will figure it out at runtime!

### Return Types

Late into development, I struggled with an issue that had me absolutely lost. My CLI kept halting and catching fire! It would stop, and nothing would happen. I spent hours trying to figure out why nothing would happen... it had worked the day before, and I changed a few things, and suddenly **boom** nothing. It got through a few I/O runs, then I'd ask it to make a new object and it would freeze. *I even went so far as reinstalling my entire Ruby environment* to find this bug. The answer was absolutely simple: my code returned `nil` not the `Product` object.

It may seem really silly, but understanding return values is a seriously basic step that could save you tons of debugging time. And as frameworks start to pile on, it gets more and more important knowing the intricacies. If you just thought to yourself *"Oh, I definitely understand return values!"* then **great**! I compiled a few examples to help check for understanding... make sure you can answer them by reflex!
- What is the return value of `puts "car"`?

- What is the return value of `pp "car"`?

- What is the return value of `"car"`?

- What is the return value of `car = "Toyota"`?

- What is the return value of `.each`?

- What is the return value of `.collect`?

- What is the return value of this block?
```ruby
def return_value
  puts "car"
  "car"
end
```
- What is the return value of this block?
```ruby
def return_value
  "car"
  return "Toyota"
  puts "car"
end
```
- What is the return value of this block?
```ruby
def return_value
  car = "Toyota"
  puts car
end
```
- What is the return value of this block?
```ruby
def return_value
  "car"
  return "Toyota"
  car = "Toyota"
end
```
### Live Code
So, what did it look like when all of this came together? During the live code portion of my CLI assessment, I was asked to code a new feature. Specifically, the ability to calculate the total calories or macronutrients of a (for time's sake) `Cabinet` instance's contents --- an accumulator. Conceptually, I put aside for a moment *how* to do it and started by asking myself *where* should it happen.
1. Where should I report the information, and where might it be asked for? Obviously, reporting the information was an *output* and asking for it would be an *input*: the single responsibility principle tells me that's the job for the `CLI` class.
2. Where should I calculate the information? The cabinet's concern is keeping track of what's in it... since the question was about how many calories *are in the cabinet*, it was a no-brainer that this method should be captured in the `Cabinet` class. Certainly there's room for argument on this, but understanding *why* I had created the `Cabinet` class in the first place is essential to understanding why I thought that would be the most appropriate home. Originally, that class was meant to be a `Meal` class, and it made sense that meals ought to know their own calorie count. Building the accumulator feature into the psuedo-`Meal` class meant that meal instances would have a `#total_calorie` method, and that just made sense.
3. What information does the accumulator rely upon? It needs to know the `Cabinet` instances products, `#product_list` and it needs access to all the product instance's `calories` attr to summate them.

The whole feature took four lines of addition: one `puts` line in the `CLI` class to report the information as output to the user, and these three lines in the `Cabinet` class:
```ruby
	def total_calories
		self.product_list.sum { |product| product.calories }
	end
```

### Final Thoughts
Refactoring my project was one of the most eye-opening things I have done so-far. Using design principles like separation of concerns, DRYness, the single responsibility principle, and the open-closed principle after failing to do so led me to truly discover for myself the power of those tools. Having a firm grasp on fundamentals, like return type and the shebang, gave me confidence going forward while also reaffirming how much I have already learned over a few short months. Hopefully this post can give you some more confidence and security in just how much you know now, too!

