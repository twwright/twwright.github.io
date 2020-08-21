---
layout: post
title:      "Debugging Rails by automatically displaying params inside your views"
date:       2020-08-21 23:06:00 +0000
permalink:  debugging_rails_by_automatically_displaying_params_inside_your_views
---


Here's a fun and easy little trick. Let's throw a `debug(params)` into our view, and then we can see what our params are for every page! In Rails, this means seeing the controller/action for every page you visit as well as any dynamic content that was used for each view --- nifty!

### 1. Add the debug

First, let's head into our `application.html.erb` page and add it into our layout, in this case right under the footer:

```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= full_title(yield(:title)) %></title>
    <meta charset="utf-8">
    <%= render 'layouts/rails_default' %>
    <%= render 'layouts/shim' %>
  </head>
  <body>
    <%= render 'layouts/header' %>
    <div class="container">
    <%= yield %>
    <%= render 'layouts/footer' %>
    <%= debug(params) if Rails.env.development? %>
    </div>
  </body>
</html>
```

(While not absolutely necessary, our post-fix conditional `if Rails.env.development?` makes sure that if we were to accidentally push this guy into production we wouldn't see it!)

### 2. Add some style

The debug will be styled using `.debug_dump` class selector.  We can use a mixin from Sass called `box_sizing` to make this extra pretty. Head into your `app/assets/stylesheets/custom.css` file and drop this in:

```css
@import "bootstrap-sprockets";
@import "bootstrap";

$gray-medium-light: #eaeaea;

@mixin box_sizing {
  -moz-box-sizing:    border-box;
  -webkit-box-sizing: border-box;
  box-sizing:         border-box;
}

.debug_dump {
  clear: both;
  float: left;
  width: 100%;
  margin-top: 45px;
  @include box_sizing;
}
```

### 3. Results
Great! Now load up your `rails server` and check out your pages. You should see a beautiful little grey box with useful info about the page that is rendered; specifically, you'll see your page `params` in a pretty little YAML format!

![debug(params) makes a lovely little YAML!](https://i.imgur.com/mPDgcyL.png)


---

*Thanks go to Michael Hartl's excellent [Learn Enough](http://learnenough.com) series for this tip!*
