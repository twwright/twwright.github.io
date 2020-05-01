---
layout: post
title:      "A Primer on Databases for Beginners (Written by a Total Beginner)"
date:       2020-05-01 02:45:52 +0000
permalink:  a_primer_on_databases_for_beginners_written_by_a_total_beginner.html
---


The content of your bloToday terms like SQL, Oracle, MongoDB are all commonplace in software engineering and web development. On the back-end, we expect a full-stack engineer to have a firm grasp on **database management**. So let's talk about what a database management system entails, starting from the very basics.

A **database** is a collection of related information stores in a manageable and accessible way. Years ago, we stored data on tapes. Super convenient, right? Not exactly. As tapes started to become unwieldy and technology outpaced the physical medium, more practical systems of data management evolved. The goal of a well-formed management system will reduce redundancy, maintain consistency, and support concurrent access. These systems provide security and support for transactions between users. They also support languages that allow us to create, add, alter, or delete data.

The core components of a database management system involve:

- **Data** and metadata --- consisting of our information
- **Databases** --- composed of software and hardware working together to give us a place for storage, retrieval, and interaction
- **Access languages**  --- comprised of tools to access and interact with the data stored in the databases

The architecture for database management systems, sometimes called **database engines** will differ in myriad ways. It could be decentralized or hierarchical; it could have graphic user interfaces; it could have multiple users, clients, or different languages, but the basic (i.e. minimum) requirements are always the same: (1) data, (2) databases, and (3) access languages. Let's talk about each of those pieces in turn.

# **Data**
![Deadpool In a Ballpool](https://media1.tenor.com/images/eccc1d26dd4c2389f8337304881bb360/tenor.gif?itemid=8897225) 
*"Data is all around us."* We tend to hear that a LOT these days. But what on earth is it, how do I store it, what do I do with it, what does anyone do with it? Let's talk about data.

Simply put: data is *information*. Every property or attribute of every moment in time can be summarized as a bit of data. Your longitude and latitude *right now* could be recorded as a piece of data --- in fact, it probably is. The ability to generate data has exploded thanks to our devices, which work constantly to produce data points, like _location_, _orientaton_, _time_, _user_. Toss in cameras, watches, cash registers, stoplights, heart-rate monitors, and more and suddenly the number of available data multiplies *n*-fold. Thanks to the meteoric rise of cheap data storage solutions, all of that sweet, sweet data can be processed into meaningful---and sometimes invasive---information. After all, data _just is_ information about our world.

Data scientists [sometimes](https://www.ibmbigdatahub.com/sites/default/files/styles/xlarge-scaled/public/infographic_image/4-Vs-of-big-data.jpg?itok=4syrvSLX) discuss data in terms of:
- **volume**: the amount of data
- **variety**: the different forms of data
- **velocity**: the speed at which data accumulates
- **veracity**: the certainty of the data

We won't cover too much about data specifically since that could be a whole series of blog posts on its own. What's important to understand as a developer is that data comes in many varieties, which we'll call *types*. The most common data types you'll encounter, especially early on, include strings, integers, and booleans. More complex data types include floating-point numbers (a.k.a. decimals), arrays, varchar, timestamps, and more. Different database systems allow different data types, and here's a perfect place to start talking about how we deal with all these different data and data types... it's time to introduce **databases!**

# **Databases**
![Perfect Tetris!](https://thumbs.gfycat.com/IlliterateExaltedKinglet-size_restricted.gif)
While there are many different models for how database systems work, we're going to focus on the model which dominates much of modern software engineering: **relational databases**. A relational database is a table, almost like a spreadsheet, organized into columns and rows. Note that most of the databases we use today are pseudo-relational---they don't quite fit and follow the strict tenets of E.F. Codd's original model---but we'll treat them as equivalent here. 

In relational databases, there are also many different terms depending on your uses, languages, or preferences. Imagine a spreadsheet with a filename, rows, and columns. The filename should be unique --- a table has a name that is distinct from all other tables in the database. A row is known as a *record*  or a *tuple*. There are no duplicate rows. A column can be referred to as an *attribute*, *property*, or *field*. The values of the columns should be the same data-type. Our spreadsheet can also be called a *table*, a *relation* or a *file*. Databases contain many tables, and tables have many records and attributes. 

Attributes themselves can be either *key* or *non-key* attributes. **Key attributes** are sometimes called *candidate keys*. A candidate key is any attribute that could be used to uniquely identify a record in a particular table. Typically, a table will assign one candidate key as a *primary key*. A primary key, or main key, is a unique identifier for a record. In pure SQL, we'll typically identify this in our table by specifying `id INTEGER PRIMARY KEY` in the schema. There are also *unique keys*. Unlike a *primary key* they're not used specifically for reference to one single row or record, but they are used to ensure there is only a single entry for items with that particular key. Also unlike primary keys, a table can have multiple unique key columns, and unique keys can be modified to new values. They can also be null.

Unique keys and primary keys ensure that a table doesn't violate an *integrity constraint*---in this case, we don't want two records with the same keys to maintain consistency over time. Primary keys and unique keys, therefore, cannot be duplicated. Candidate keys that are not used as primary keys are sometimes called *alternate keys*. A record can be referred to in a different table by referencing its primary key; in this case, we call the reference a *foreign key*. Put otherwise, a foreign key says "Hey, this thing is also over there!" This helps to establish specific relationships between the records in different tables. A foreign key must exist as a primary key in some reference table ---- this is known as *referential integrity*.

This capacity of tables to be related to one another is why we call these databases, well, *relational*---the ability to bind two different tables together using foreign keys allows us to map out relations between records in different tables. The possibilities become endless.

There are many kinds of other keys, such as including superkeys, composite keys, and more. Attributes that are not considered keys are known as **non-key attributes**. The count of all attributes in a table is called the *degree*. Along with identifying which attributes are key or non-key, we also want to specify the type of data we'll expect to store and retrieve from an attribute.

Earlier we talked about how data comes in different _types_. Our database needs a way to know what kind of data it can expect. _Typing_ is the practice of explicitly declaring the types of data you intend to store in each column of a table. *Typing* tells us the available *domain* of data for the column, field, or attribute. We do this to optimize efficiency and normalize the data. You wouldn't want to be constantly checking, converting, validating data entered into the table; instead, we want to be able to store data in a normalized format that is repeatable and expected. This normalization or consistency across our data types empowers us to calculate, to search, to sort, and to perform many more tasks that would be much more challenging if we were to mingle disparate data types.

Earlier that there were three ingredients to databases: the data itself, a storage system, and a way to interact between the two. Our data, systematized into attributes and records collected into tables, now has its storage system! All that remains is how we get data into the table and back out again... we need an *access language*!

# **Access Language**
![Languages rule the world!](https://thumbs.gfycat.com/DamagedImportantAmurratsnake-size_restricted.gif)
**Structured query language** is the most common access language for interacting with data and databases. SQL is a domain-specific language (DSL) for looking into databases, updating them, creating them, and much more. It's composed of keywords (by convention, these are capitalized), operators (for comparison or manipulation), and functions (transforms the results for presentation).

Of notable benefit to using SQL is its ability to work across languages. Anything stored in a database is, by nature, reusable. Since most programming languages have libraries that allow us to make use of a relational database, we can, in theory, access it using different languages so long as those languages can write into SQL. Think of SQL as the bridge between your preferred coding language (Java, Ruby, JavaScript, etc) and your database --- it is, in essence, a *lingua franca* for communicating with a database. 

SQL has the ability to perform all CRUD operations on a database. **CRUD** is short for create, read, update, and delete. SQL allows us to design the database schema (what our tables, rows, and columns will look like). We can then insert records into those tables, select records to read, update them, alter them, transform them, aggregate them, order them, limit results, page results, rewrite them to be printable, and so much more. Selecting data in SQL is known as a *query*. A query returns a result set which can be filtered further to return a singular answer. 

If you are familiar with set theory in mathematics, a lot of the power of tables, and of SQL's ability to manipulate those tables, comes from treating them as sets of data. SQL lets us perform operations akin to unions, intersections, and exceptions in the form of inner joins and outer joins. *Joins* are just a way to merge multiple tables to select or filter overlapping (or non-overlapping) results. 

It is common for non-database-specific engineers to deal with databases. And, to be quite honest, SQL is not the most enjoyable language to work in (YMMV). Fortunately, there are tools in most languages to allow you to write SQL without actually writing any raw SQL. Coupling these so-called *adapters* with object-oriented languages is especially powerful. We can implement something called **object-relational mapping**, which lets our applications bind database records to corresponding objects, which gives us access to our full dev toolbelt. By abstracting our data into objects and classes, we gain the ability to do fun and creative things that wouldn't be possible within the databases. More importantly, when we're done doing all of our fun and creative things, we can persist those objects back into our tables as data once more.

![ORMs are MAGIC](https://media3.giphy.com/media/12NUbkX6p4xOO4/200.gif)

## Conclusion

Today we touched on the basics of a database management system, from top to bottom. We talked about the three pieces of a DBMS: data, databases, and access languages. We concluded that data are discussed in terms of volume, variety, velocity, and veracity. We spoke about how the relational database model has come to dominate the database management, and how we can use keys in databases to uniquely store and identify records. We also spoke about the power of SQL to manipulate records and tables in our database, and SQL's ability to serve as an intermediary between our higher-level programming languages and our databases' information. We also briefly touched on how adapters and ORMs can allow us to manipulate data as objects and classes within our applications. Hopefully, we clarified how just a few pieces of the giant data puzzle fit together without managing to completely glaze over in confusion! g post goes here.
