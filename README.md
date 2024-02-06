<div align="center">

<img src="assets/logo.png" width="125">

# mdbadges-cli

[![Release](https://img.shields.io/npm/v/mdbadges-cli.svg?style=flat&colorA=18181B&colorB=07B0D1&logo=npm&logoColor=eb6f92)](https://github.com/inttter/mdbadges-cli/releases/ "The latest NPM version.")
[![NPM Downloads](https://img.shields.io/npm/dw/mdbadges-cli.svg?style=flat&colorA=18181B&colorB=07B0D1&logo=npm&logoColor=eb6f92)](https://www.npmjs.com/package/mdbadges-cli/ "The amount of downloads via NPM per week.")
[![License](https://custom-icon-badges.herokuapp.com/github/license/inttter/mdbadges-cli?logo=law&color=07B0D1&logoColor=eb6f92&labelColor=191724)](https://github.com/inttter/mdbadges-cli/blob/main/LICENSE/ "The project license.")

```mdbadges-cli``` is a command line tool that allows you to find Shields.io badges without needing to leave your terminal and scour the internet just to find a specific one.

</div>

There's a number of features available, allowing for maximum productivity, including:

* A wide range of over 400+ badges
* 30+ categories to search between
* Markdown and HTML support for most commands
* Aliases for many commands
* Custom badges just by using simple prompts
* Random badge generation
* [**and more...**](https://inttter.gitbook.io/mdbadges-cli/) 💎

# Getting Started

> [!IMPORTANT]
> You need at least [**Node 18**](https://nodejs.org/en/blog/release/v18.0.0) to install this package.

###### Versions below [**v4.4.2**](https://github.com/inttter/mdbadges-cli/releases/tag/v4.4.2) require Node 16.

Install the package as you would with any other, using:

```bash
npm install -g mdbadges-cli
```

<!-- NPM Publish Workflow and Tests Workflows !-->
[![Release to NPM](https://github.com/inttter/mdbadges-cli/actions/workflows/publish.yml/badge.svg?event=release)](https://github.com/inttter/mdbadges-cli/actions/workflows/publish.yml) [![Tests](https://github.com/inttter/mdbadges-cli/actions/workflows/test.yml/badge.svg)](https://github.com/inttter/mdbadges-cli/actions/workflows/test.yml)

To start using a command, add the ```mdb``` prefix, followed by the [**command name/syntax**](#commands). For example:

```bash
mdb social-media discord

# Badge found:
# [![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white)](#)
```

Need to find what something does while your in the terminal? Run ```mdb help / -h``` to view all commands, aliases, and additional options.

# Commands

###### For more in-depth information, read the documentation [**here**](https://docs.mdbcli.xyz)

|   Command      |    Description    |     Aliases      | Additional Information |
|----------|-----------|---------------------------|--------|
```mdb <category> <badgeName>``` | Displays Markdown for specified badge in a category | N/A | Prefixes available include: ```--style```, ```-s```, ```--html```, and ```--link```. **Finding more than one badge is supported.**
```mdb search``` | Displays badges available in a [**category**](#available-categories) | ```s```, ```find```  | Use arrow keys to scroll up/down.
```mdb lookup <query>``` | Displays badges containing a certain keyword/phrase | ```l``` | Also displays what category the badge is in
```mdb create``` | Displays prompts to create your own badge | ```generate``` | **All fields** require an answer
```mdb random``` | Displays a random badge. | ```r``` | Supports both Markdown and HTML formats. Supports specific categories using ```--category``` or ```-c```
```mdb copy <category> <badgeName>``` | Copies a badges' code to the clipboard | ```c``` | On Windows 11, you can do <kbd>⊞</kbd> <kbd>+</kbd> <kbd>V</kbd> to verify it's been copied
```mdb badges``` | Opens a link to the badge list in your browser. | ```list``` | Both links will be displayed after a few seconds, in case it does not open in your *(default)* browser.
```mdb add <category> <badgeName> <fileName>``` | Allows you to add a badge to a Markdown file | N/A | **Only ```.md``` files are supported.** Will work in subdirectories, so long as the file path is correct

# Miscellaneous Commands

###### Commands which don't serve ***too*** important of a purpose

|   Command      |    Description    |     Aliases      | Additional Information |
|----------|-----------|---------------------------|--------|
```mdb version``` | Displays the current version you are on | ```v``` | **Don't try to use this command to update.** This is for checking your version, use ```mdb update``` (see below) to update
```mdb update``` | Checks for updates to the package | ```upd```, ```u``` | ```npm install``` can be directly ran from this command.
```mdb fund``` | Displays funding/donation links for the package | N/A | You don't have to donate, but I'd appreciate it!
```mdb about``` | Displays general information about the package | ```abt``` | Also shows links to the website, GitHub issues, contributing, and more
```mdb documentation``` | Opens a link to the documentation in your browser. | ```docs``` | Again, the link will be displayed after a few seconds, in case it does not open in your *(default)* browser.

# Available categories

Below you'll find categories that are currently available, with the name and syntax needed in commands which need a ```<category>``` specified.

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
Cryptocurrency | crypto
Database | database
Design | design
Documentation | documentation
Education | education
Funding | funding
Framework | framework
Game Engine | game-engine
Gaming Storefront | game-stores
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
Work/Job | work-and-jobs

# Contributing

There are multiple ways to contribute and improve this package.

* [**New Features**](https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md#features "Features" ) - Features/Improvements which improve user experience.
* [**Adding Badges**](https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md#adding-badges "Adding Badges") - New badges to be added to the already large list of badges.
* [**Questions**](https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md#adding-badges "Questions") - Questions about the package, which can spiral into new features/improvements/suggestions.
* [**Bugs/Inconsistencies**](https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md#bugsinconsistencies "Bugs/Inconsistencies") - Issues within the package or something that doesn't look right.

##### [Read the full contributing guidelines here.](https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md)

---
<div align="center">

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/intter)

###### ©  <http://license.inttter.com>
