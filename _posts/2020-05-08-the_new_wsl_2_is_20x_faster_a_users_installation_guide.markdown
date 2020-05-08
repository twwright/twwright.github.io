---
layout: post
title:      "The New WSL 2 is 20x Faster?! A User's Installation Guide"
date:       2020-05-08 12:39:20 -0400
permalink:  the_new_wsl_2_is_20x_faster_a_users_installation_guide
---


Windows has finally released WSL 2, and it's *smooooooooth*. Microsoft describes it as such: "WSL 2 is a major overhaul of the underlying architecture and uses virtualization technology and a Linux kernel to enable its new features." 

If you're like me, you found the first iteration of WSL to be an absolute slog. Slow, unruly, resource-heavy, and sometimes just downright buggy. Fortunately, Windows has delivered us an update that fixes tons of these issues, with reported speed boosts of anywhere between 3-6x faster (when running `git` commands, setting up libraries, and more) to 13x-20x faster (miscellaneous filesystem commands, such as unzipping `tar` volumes). That's a performance boost that is **way** worth the upgrade! After installing, I can definitely confirm: WSL 2 is *faaaaaaaast*. Like, way faster. A `bundle install` in Rails takes only a few seconds, where on WSL 1 it could sometimes take actual minutes. If you're ready for that kind of upgrade, follow along with the steps below!

![time for two](https://www.quittrain.com/applications/core/interface/imageproxy/imageproxy.php?img=https://media.giphy.com/media/aaMosvrTpTvCo/giphy.gif&key=cec2464a6f167ad91784cf0c42176806afdc8cdfdea7a81469396177d9313dc5)

We're going to take a few steps here, so I wanted to give a roadmap of where we're headed. ([Click here](#tldr) if you just want to jump to the TL;DR short version of this post!) WSL2 doesn't quite run out of the box yet; it requires a few features that WSL1 didn't use, specifically the "Virtual Machine Platform". First, we'll update our system, then we'll turn on VMP, and last we'll install the WSL2 kernel. From there, it's off to the races! 

One word of warning before starting: there are a few (very few) changes in WSL2 that might impact your typical workflow. The biggest difference I've experienced is that running a server, e.g. rack or rails, will no longer use `localhost`. Since WSL2 runs inside a virtual machine, you'll be given a local IP address to use instead. The speed boosts make this small change absolutely WORTH it!

So, what are you waiting for? **Let's get started!**

*Pro Tip: Before starting, install the new preview of the [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal-preview/9n0dx20hk701). Use it to quickly switch and open multiple terminals across kernels, including command prompt, Bash, Powershell, and more.*

## Step One: Update Windows

#### 1. Check your current version
Let's start by checking our version of Windows by heading to the start menu and opening the `command prompt` (just type `command` into the start menu). If you weren't aware, Windows has both a **build** number and a **version** number. Typing `winver` into the command prompt will give us a full breakdown of our current build and version. 

![winver display window](https://i.imgur.com/IoAFNsr.png)

Some [older documentation](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install) from last year indicates that you'll need a build higher than 10.0.18917. Some [newer documentation](https://devblogs.microsoft.com/commandline/wsl2-will-be-generally-available-in-windows-10-version-2004/) suggests build 19041. Rather than getting caught up in build numbers, we'll focus on the **magic version number**: 2004.

#### 2. Update Windows through your settings
Go ahead and open your Windows settings to the "**Updates and Security**" page. If you see an "**Update Now**" button, go for it! You can force Windows to check for updates by clicking "**Check for Updates**." If you're like me, my automatic updates only scooted me to version 1903... I think I may have missed a few updates. Oops! Either way, go ahead and install any updates you need. I'll wait!

#### 3. Join the Windows Insider Program
Okay, so you may not be on **Magic Version 2004** yet. To jump ahead a few more versions, we'll have to join the [Windows Insider Program](https://insider.windows.com/en-us). Head to that page, and click the blue box that says "**BECOME AN INSIDER**". You'll be prompted to sign in to your account, do so!

![become an insider](https://i.imgur.com/CHxgvy4.png) 

Next, head back to your "Updates and Security" menu. Click the "Windows Insider Program" on the bottom left side. Follow the instructions that pop up. It should ask you to "connect your account", and you should use the one you just chose on the "Become an Insider" webpage. Then it'll ask you to select an Insider track. Fortunately, WSL2 is available on both the **Slow** and **Fast** tracks. I selected **Slow** since it's a little more stable and has less frequent updates. From there, you'll be prompted for a few restarts. These took a *very* long time and made a lot of noises... in fact, I wrote this entire post while I waited! Bookmark this page and come back when you're done, or go ahead and open it on your phone. I'll be here when you get back.

## Step Two: Turn on Virtual Machine Platform

The **Virtual Machine Platform** was, as far as anyone can tell, designed specifically for WSL2. While the feature has been available for a while now, you probably didn't have it turned on. In the past, WSL relied on Hyper-V. While that still may be true, the Virtual Machine Platform is the catalyst for WSL2's blazing speeds. At least, we *think* so. Quite honestly, it's hard to find much information about VMP online. It looks like it's part of a bigger program at Microsoft to support a wider array of virtualization options for users. If you know more about this, drop some knowledge in the comments section! Either way, it's the key here to getting WSL2. Let's turn it on now.

1. Head to your start menu, and type "**windows features**" and select "**Turn Windows Features On/Off**".

2. Find and select "**Virtual Machine Platform**." This should activate the VMP feature!

![virtual machine platoform](https://i.imgur.com/79yUy72.png)

3. Reboot!

Not so bad, was it? Time to update our kernel.

## Step Three: Update the WSL2 Kernel

Rejoice! This isthe easiest step so far. 🙌 Head to the Microsoft website to [download the Linux kernel update](https://docs.microsoft.com/en-us/windows/wsl/wsl2-kernel). Once downloaded, run the update package. You'll be asked about giving admin permissions, select "**yes**" to approve, and the install will begin.

The cool part of WSL2 and the new kernel is that it's a **real** part of Windows. By that, I mean you should no longer have to jump through hoops to install updates! In your Windows settings, you've sometimes seen the 'Check for Updates' button that quickly updates applications related to your PC like drivers, Windows software like Defender, or other items *en masse*. Thankfully, Microsoft is now using this method to deliver updates to the Linux kernel in WSL! 

## Step Four: Update your Linux distros

Okay, back to the command prompt! Type `wsl -l -v`. This should give you an output with information about your Linux builds. I have **Ubuntu** and **Kali** installed in WSL. I don't use Kali too much at the moment, so I'm just going to update Ubuntu to version 2.

![version 1 of distros](https://i.imgur.com/At18Nza.png)

Let's change those version numbers! In the command prompt, type:

`wsl --set-version Ubuntu 2`

This will begin the process of converting Ubuntu over to WSL 2. It took mine quite a bit of time to do... like, a **LOT** of time. In fact, I was worried it wasn't working. I looked into it, and found a post about this on Reddit. A WSL developer responded and clarified that, essentially, the conversion from WSL 1 to WSL 2 requires Windows quite literally transferring your **entire** file system to a virtual system. So if you have a lot of things installed---frameworks, languages, utilities, etc---it can take a very long time. Mine finished in just under two hours, some reported even longer times. The good thing, however, is that when you're done, **YOU'RE DONE!**

![two two two 2](https://www.animatedimages.org/data/media/712/animated-number-image-0196.gif)

**Congratulations!** You're now running the latest and greatest version of the Windows Subsystem for Linux: WSL 2! **HAPPY CODING!**

<a name="tldr"></a>
## The TL;DR Version

1. Update Windows to at least version 2004. If you can't do it through Windows Update, you'll need to [join the Insider Program](https://insider.windows.com/en-us) on either the **Slow** or **Fast** track.

2. Turn on the Virtual Machine Platform in your Windows features.

3. Install the [WSL2 kernel](https://docs.microsoft.com/en-us/windows/wsl/wsl2-kernel).

4. Update each distro from the command prompt. Type `wsl -l -v` to see the current distros, and `wsl --set-version <Distro> 2` to convert them.

<hr> *Looking for some more info? [Click here](https://docs.microsoft.com/en-us/windows/wsl/wsl2-index) to check out a full list of changes in WSL 2, as well as further documentation from Microsoft.*
