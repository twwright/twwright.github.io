---
layout: post
title:      "Creating Foodexplorer: My CLI Project"
date:       2019-12-19 00:16:55 -0500
permalink:  creating_foodexplorer_my_cli_project
---

### __The Original Intent__
My intent was to design a simple command line application, called __Macrocounter__, that could calculate a person's recommended macronutrient ratio for their specific fitness or weight-loss goals. Typically this is broken into three categories: lose weight, maintain weight, gain weight. There's research behind the approach of balancing our intake of proteins, carbs, and fats that support different fitness-specific goals. Using some fun little math formulas developed by researchers, we can take in a user's attributes (hereafter: attr) and use that to calculate their macronutrient ratio. From there, users would then be able to search for a food, display it's macronutrient content, log it to their daily food list, and it would calculate their current intake of nutrients vs their allowable intake. The set-up was simple, and the objectives achievable:

- Create a `User` class with an `attr_accessor` for name, age, weight, height, goal. Use a formula to determine their ideal macronutrient ratio and set that as a `:ratio` attr.
- Create a `Meal` class with an `attr_accessor` for description, protein, carbs, fats, and overall calories. 
- Create a `Product` class with an `attr_accessor` for each individual product and have a belongs_to relationship to the meal class. 
- The plan looked like this: When the user logged a meal, it would instantiate an object of the `Product` class. The product class would be responsible for making a search call to the API, the API would return some results (probably limited), and we could select an item. The product would then set the protein, carbs, fats, calories for that particular Product, as well as link it to a meal. The meal class would keep track of the accumulated macros and calories for all the products identified with that particular meal object.

But, if you have played with the CLI gem, you'll immediately notice _none of this is there_. So what happened to the plan?

#### The Limitations

##### Time
The amount of time it would've taken to fully develop out some of these details for this particular project meant it would take a bit longer than it really should take... after all, there's more advanced things to learn that could make this project a whole lot easier, and --- assuming it ever saw the light of day as a useful tool --- most people who would benefit from it probably aren't looking for a command line gems to track their food! Especially one without the utility of persistent user data from session to session.

##### Scope 
The scope of the project was to demonstrate the ability to write Ruby classes that could interact, as well as gather data and assign data from an API or scraper. That goal could be accomplished in a far simpler project.

##### Data 
Using APIs is, at times, unpredictable and can present it's own challenges. In the course of this project, I attempted to use several different APIs. For nutritional information, it's surprisingly difficult to find well-managed, clean, _public_ APIs. Why? Well, there's a lot of money to be made with ulities like this. Adidas, Nike, UnderArmor.... they all have their own nutrition trackers just like mine that need to get data _from somewhere_. So, obviously, all of those somewheres like to charge money. Can you blame them? That led me to look for some free, public alternatives. Unsurprisingly, the free alternatives had masses of data --- far more than I would need --- and were somewhat complex in their implementations and somewhat lacking in documentation for a project with modest goals like mine. Eventually I landed on the API of the good folks at [Spoonacular](google.com). Their free version had enough API calls included to be useful, and the data returned was exactly what was needed... _almost_.

##### Search
It turns out --- who knew! --- search is _hard_. After getting the Spoonacular API up and running, writing some methods to allow the user to search for a product, I quickly found out that the results the Spoonacular API returned were... really, kind of awful. I was hoping displaying the first results of a search would land on at least one result that, for demonstration purposes, could approximate something useful. This turned out to be extremely unpredictable... searches for "carrots" would return results like "carrot cake" or "carrot-flavor add-in." Searches for "chicken" returned, as a first result, "buffalo chicken dip." It was clear it would take some work to get the search to be useful, or else it'd be a wasted endeavor. 

Intentionally, I allowed the above challenges to limit my project --- after all, if I were truly let loose to create something, we'd be looking at a fully decked-out, killer app! Resisting that urge was practically the most difficult part.

I decided instead to produce a __minimum viable product__ for this project, even it meant jettisoning the utility and practicality of my coveted __Macrocounter__. The new goal was to create more of a random game, called __Foodexplorer__. The user would open a cabinet in their kitchen to discover some items, and they could then explore the nutritional value of those items. There was no more logging by the User --- it was suggested that I save this functionality for when we introduce things like databases. There was no more searching --- let's leave that for a bigger project, or at least one with a more useful UI. What remained was the satisfaction of the project's modest goals: manipulate data received from an API or scraper as Ruby objects, including maintaining relationships between different objects.


### __Producing an MVP__

#### Defining and Ideating
With our new goal in mind, I began dissecting the pieces that would need to fit together to make the gem run. I knew I needed to have at least three classes: the `Product`, the `Cabinet`, and the `CLI` to control the user's flow through the interface. Let's step into each one of these classes, starting with the _lowest_ in the heirarchy.

##### Product
Products are objects which have nutritional attributes, such as `:protein, :fat, :carbs, :calories`. They have a `:name` and they are located in a `:cabinet`. Initially, when I approached the problem, I didn't include `:cabinet` as an attribute. Although this should've been immediately obvious, it was something I had overlooked. It wasn't until I began writing a method that would allow the user to look up the products in each cabinet that I realized this would have significant utility. For each of these attributes, I intentionally used an `attr_accessor` --- that meant each attribute could be written or read. At instantiation, a `Product` stores the `result` of an API call to Spoonacular Spooonacular actually provides a huge amount of data in their JSON reply. Since the `title` and `nutrition` data I wanted was in a nested hash, I used `result["title"]` and `result["nutrition"]["calories"]`(etc) to set the `Product`'s `attr` for each corresponding value.

##### Cabinet
Cabinets store products. But which products? The `Cabinet` class was responsible for creating new objects, since a cabinet needed to be opened to see what was in inside! To determine the amount of items inside, I'd pick a random number between 0 and 3. Limiting the amount of products inside each cabinet to three or fewer was a simply pragmatic. The `Cabinet` class then uses a loop to create a new `Product` object. On initialization, a `product` object is generated by randomizing a number up to six digits, interpolating the number into the API call, and returning JSON asssociated with the random ID.  

##### CLI
The `CLI` class handles the user's flow through the application. It prompts the user for input and uses that input to make decisions about what to do next. It also gives instructions and generally guides the user. It also handles exiting for every possible command.

#### Testing and Revising
In testing, many issues came to light which I was unprepared for. I'll outline a few of the most pressing concerns that required some quick-witted solutions.

##### Handling words and integers
I made the choice to give the user the option to use both words and numbers at various points through the CLI gem. This was probably an unnecessary difficulty, but it felt like a more natural way to interact. I would've liked to have made products selectable by their names, as well, but in the end it was just simpler to use numbers for identifying items in lists. 

##### Referring to the products by their cabinet number
Early on, I didn't include a `:cabinet` attribute for a `Product` instance. Absentmindedly, I ran into a lot of issues trying to recall which product instances were in which cabinet instances, and I ended up writing some very, very overdone code. After a day or two off from working on the project, I returned to it with new eyes and realized that I had just been spinning my wheels on something that could be solved way simpler! Live and learn.

##### Nonexistent products
One thing I didn't anticipate was that *not all random six-ish digit numbers would return a result*. It wasn't until testing my app over and over and over again that I ran into this issue of getting back empty products. I spent a while debugging my code, thinking there was a problem with the way it was returning values from Spoonacular or a problem with the way it was displaying them. What I realized was simply that __there was no item for that numeric ID in Spoonacular__. I decided to write a new instance method, `Product#try_again` that would simply retry the randomization procedure if `nil` was returned. My motivation for using an entirely new method, specifically named `try_again`, was so that if bash displayed the errors in the traceback, I'd be able to see whether it had been called. Later on during testing, I found another issue with Spoonacular not returning values for some IDs for various other reasons. I decided to rewrite the conditional in the `initialize` to a `case` statement that checks `result["code"]` for errors `400` or `404`. If so, they'd call `Product#try_again`, else they'd run as normal to do the attribute assignment for the instance.

### __TODO__
Although I likely won't develop this project further --- at least, not as a command line tool --- it was important that I include a few notes on functionalities I'd like to see included. Without substantially changing the intention or spirit of __Foodexplorer__, here's a few things I would add:

##### Store the Randomized Product ID
It would take all of one or two lines to store the randomized six-ish digit number that the `Product` creates on initialization to get data. Having this number stores as an ID for each instance of the class would be useful if I were to ever add features to the app that searched through the API's JSON for more information than simply nutritional data --- for example, serving sizes, etc. Not having that value stored means that recalling the full JSON for each product is currently impossible.

##### Look-Up or Order by Nutrient Content
Using something like a `Product.all.sort_by { |product| product.fat }` could sort all of the objects by their fat content, for example. I could also use something like `Product.all.select { |product| product.fat == input }` if I wanted to give the option to look up by an amount of fat, or more likely something like `<=` or `>=`. (For what it's worth, in the original __Macrocounter__ gem, this feature would've been useful for allowing users to figure out what else they could eat to fulfill their recommended percentages.)

##### Search
Obviously, bringing the ability to search through products would be a useful feature. Even in its current implementation, searching would be a fun addition --- after all, you ought to be able to search through your cabinets for something! This feature isn't included since it would really just be some icing on the cake; it was by no means a _necessary_ functionality for __Foodexplorer__. Since I can't claim any fame to being an expert in RegEx, I would've either spent a huge amount of time working on coming up with good RegEx _or_ using an `.select` method that iterated through `Product.all.name` to match characters with the `.include?` method.

##### A User and Kitchen Class
I really, _really_ wanted to develop a `User` class that would allow a `Cabinet` to be assigned to `Kitchen` and a `Kitchen` to be assigned to a `User`. Although it would've been a fun addition, that level of abstraction for this particular project was really unnecessary --- especially after leaving behind the __Macrocounter__ project.
