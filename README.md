<div align="center">

<img src="assets/logo.png" width="125"> 

# mdbadges-cli

[![GitHub Version](https://img.shields.io/github/release/inttter/mdbadges-cli?style=for-the-badge&logo=github&color=3c2e9f&logoColor=eb6f92&labelColor=191724)](https://github.com/inttter/mdbadges-cli/releases/ "The latest releases, with changelogs.")
[![NPM Downloads](https://img.shields.io/npm/dw/mdbadges-cli?style=for-the-badge&logo=npm&color=2560ce&logoColor=eb6f92&labelColor=191724)](https://www.npmjs.com/package/mdbadges-cli/ "The amount of downloads using NPM, per week.")
[![License](https://custom-icon-badges.herokuapp.com/github/license/inttter/mdbadges-cli?style=for-the-badge&logo=law&color=3c2e9f&logoColor=eb6f92&labelColor=191724)](https://github.com/inttter/mdbadges-cli/blob/main/LICENSE/ "The legal stuff related to this package.")

<img src="assets/Intro.png" alt="Intro" width="550">

<br>

[![Open an Issue](https://custom-icon-badges.demolab.com/badge/-Open%20Issue-gold?style=for-the-badge&logoColor=black&logo=issue-opened)](https://github.com/inttter/mdbadges-cli/issues/ "Click here to open an issue") 
[![Pull Requests](https://custom-icon-badges.demolab.com/badge/-Pull%20Requests-gold?style=for-the-badge&logo=git-pull-request&logoColor=black)](https://github.com/inttter/mdbadges-cli/pulls/ "Click here to submit a pull request")
[![Install Package](https://custom-icon-badges.demolab.com/badge/-Install%20Package-gold?style=for-the-badge&logo=package&logoColor=black)](https://www.npmjs.com/package/mdbadges-cli/ "Click here to view the NPM page.")

</div>

# 👎 The Problem

Badges have become useful parts of documentation, whether it's to display information, promote, or anything else.

However, there isn't a way to access them from the command line. Some people don't feel like going onto Google, and typing **"youtube shieldsio badge"**, then copying ➜ pasting, because of how time consuming it is.

# ✅ The Solution?

To make a command line tool to access a bunch of different badges, so that you ***don't*** have to leave your terminal, saving yourself some time in the process.

# ✨ Features

* 🤏 Small in size to install ─ **about ~2MB gzipped** 

* 📦 A **low** dependency count

* 👥 A **wide range** of over 400+ badges to explore from

* 🎨 **5** supported Shields.io styles to choose from

* ✏️ Choose to use **Markdown** or **HTML** in supported commands 

* 🔎 Over **30+** categories to search from ─ more variety!

* 😎 Easily create your **custom** badges with just simple prompts

* 🎲 Generate a badge **at random** ─ supports **Markdown** and **HTML**

* 🩳 Convenient **aliases** for most commands

# 📦 Installation

To install the latest version from **npm** or **Yarn**, run the command:

```bash
npm install mdbadges-cli@latest
# or
yarn add mdbadges-cli@latest
```

<br>

**➜ If you'd like, you can view changelogs between versions [here](https://github.com/inttter/mdbadges-cli/releases).**

# 📸 Demo

https://github.com/inttter/mdbadges-cli/assets/73017070/8127217f-aa85-447a-82b8-aa80873f5fcc

# 📝 Documentation

Documentation for **mdbadges-cli** can be found [**here**](https://inttter.gitbook.io/mdbadges-cli/).

# ⚙️ Commands

When using commands, use the prefix ```mdb```, and then add the command name after it.


|   Command      |    Description    |     Aliases      | Additional Information |
|----------|-----------|---------------------------|--------|
```mdb <category> <badgeName>``` | Displays Markdown for specified badge in a category | N/A | Prefixes available include: ```--style```, ```--html```, and ```-s```. **Finding more than one badge is supported.**
```mdb search``` | Displays badges available in a [**category**](#list-of-available-categories) | ```s```, ```find```  | Typing something like "Social Media" will bring up the  ```social-media``` category.
```mdb lookup <query>``` | Displays badges containing a certain keyword/phrase | ```l``` | Also displays what category the badge is in
```mdb categories``` | Displays a list of all available categories | ```cat``` | N/A
```mdb create``` | Displays prompts to create your own badge | ```generate``` | **All fields** require an answer
```mdb random``` | Displays a random badge. | ```r``` | Supports both Markdown and HTML formats
```mdb copy <category> <badgeName>``` | Copies a badges' code to the clipboard | ```c``` | On Windows 11, you can do <kbd>⊞ + V</kbd> to verify it's been copied
```mdb badges``` | Displays links containing the full list of badges | ```list``` | Both links link to the same list, on different websites
```mdb add <category> <badgeName> <fileName>``` | Allows you to add a badge to a Markdown file | N/A | **Only ```.md``` files are supported.** Will work in subdirectories, so long as the file path is correct

# Miscallenaous Commands

|   Command      |    Description    |     Aliases      | Additional Information |
|----------|-----------|---------------------------|--------|
```mdb version``` | Displays the current version you are on | ```v``` | **Don't try to use this command to update.** This is for checking your version, use ```mdb update``` (see below) to update
```mdb update``` | Checks for updates to the package | ```upd``` | If a new version is available, it will prompt you to enter an ```npm``` update command
```mdb fund``` | Displays funding/donation links for the package | N/A | You don't have to donate, but I'd appreciate it!
```mdb about``` | Displays general information about the package | N/A | Also shows links to the website, GitHub issues, contributing, and more

# 🔍 Viewing Commands

Need to find what these commands do while your in the terminal? Run ```mdb -h``` to view all commands, aliases, and additional options.

# 📃 List of available categories

Below you'll find categories that are currently available, with the name and syntax needed in these commands for the ```<category>``` section:

```
mdb <category> <badgeName>

mdb search <category>

mdb s <category>

mdb find <category>
```
> [!TIP]
> Want to add your own **badge** or **category**? You can contribute to this repository you're seeing right now, or [**md-badges**](https://github.com/inttter/md-badges)!

| Name | Syntax |
|---------|---------------|
App Store | app-store
Artificial Intelligence | ai
Blog | blog
Browser | browser
Code Coverage | code-coverage
Code Editor | code-editor
Cloud Storage | cloud-storage
Cloud System | cloud-system
Collaboration | collaboration
Cryptocurrency | cryptocurrency
Database | database
Design | design
Documentation | documentation
Education | education
Funding | funding
Framework | framework
Game Engine | game-engine
Gaming Storefronts | game-stores
Game Engine | game-engine
Office | office
Operating System | operating-system
Package Manager | package-manager
Payment | payment
Programming Language | programming
Restaurant/Delivery | restaurant-and-delivery
Search Engine | search-engine
Social Media | social-media
Sound | sound
Static Site | static-site
Video Streaming | video-streaming
Virtual Reality | virtual-reality
Work/Jobs | work-and-jobs

###### ©️ Licensed under the [MIT License](LICENSE).
###### ©️ Shields.io is licensed under the [CC0-1.0 License](https://github.com/badges/shields/blob/master/LICENSE).