---
layout: post
title:      "Quickly Open a File in the Browser from WSL"
date:       2020-10-17 19:55:42 +0000
permalink:  quickly_open_a_file_in_the_browser_from_wsl
---

Mac users have this magic convenience of typing `open index.html` into their terminal to open a file from their current directory in the browser. Those of us on WSL aren't so lucky. If you're lucky, then `open` command will open a windows directory. Cool, I guess? But not exactly super helpful. The internet abounds with recommendations --- from trying `xdg-open` to `browse` to even more convoluted methods. But the question remains: what's the easiest way to open an HTML file in the browser from WSL?

The closest thing I've found is to use the Windows Subsystem for Linux's `explorer.exe` command. So, for example, typing `explorer.exe index.html` will open the file `index.html` in your default browser. That's the simplest version of Mac's `open` command. Sort of.

Typing `explorer.exe` is still a little bit of a handful, and I'm lazy. I mean `open` is four characters, and `explorer.exe` is twelve. That's three times as many characters. No thanks!

Wouldn't it be nice if we could do something simpler? How about `see index.html`? Fortunately, we can leverage the ability to create aliases in bash to make this dream a reality. Just drop the following into your terminal:
```bash
echo "alias see='explorer.exe'" >> ~/.bashrc && source ~/.bash_profile
```

Now... wait, no, that's it. You're done. Now you can just type `see index.html` to open your `index.html` file in your browser. And you can use one fewer character than those Mac folks. Just imagine what you could do with the time savings... 

![a bear is dancing happily](https://media4.giphy.com/media/tsX3YMWYzDPjAARfeg/source.gif)
