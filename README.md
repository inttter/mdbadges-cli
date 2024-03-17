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

# Installation

```bash
npm install -g mdbadges-cli # Node 18 is required.
```

[![Release](https://img.shields.io/github/actions/workflow/status/inttter/mdbadges-cli/test.yml?branch=main&colorA=18181B&colorB=07B0D1&logo=github&logoColor=959DA5&label=Release)](https://github.com/inttter/mdbadges-cli/actions/workflows/publish.yml "The continuous integration workflow.")
[![Tests](https://img.shields.io/github/actions/workflow/status/inttter/mdbadges-cli/test.yml?branch=main&colorA=18181B&colorB=07B0D1&logo=github&logoColor=959DA5&label=Tests)](https://github.com/inttter/mdbadges-cli/actions/workflows/test.yml "The testing workflow.")

# Getting Started

To start using a command, add the ```mdb``` prefix, followed by the [**command name/syntax**](#commands). 

For example:

```bash
mdb social discord

# Badge found:
# [![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white)](#)
```

If you want to use a prefix, such as ```--style```, you can run the same command with the prefix after it (prefixes have -- or - before them). 

For example:

```bash
mdb social discord --style plastic

# Badge found:
# [![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white&style=plastic)](#)
```

> [!TIP]
> If you're running mdbadges-cli in Visual Studio Code, try installing the [**Image Preview**](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview) extension. You can hover over the badge link to see a preview of it. See an example [**here**](https://github.com/inttter/mdbadges-cli/assets/73017070/f39fc296-25c8-4a2a-846a-cf83eff00cc4).

For help information, such as what commands do and/or accept, run ```mdb help / mdb -h``` in the terminal. Alternatively, you can read the documentation [**here**](https://docs.mdbcli.xyz).

# Commands

|   Command      |    Description    |     Aliases      | Additional Information |
|----------|-----------|---------------------------|--------|
```mdb <category> <badgeName>``` | Displays Markdown for specified badge in a category | N/A | Prefixes available include: ```--style / -s```, ```--html```, ```--jsx / --tsx```, and ```--link```. **Finding more than one badge is supported.**
```mdb search``` | Displays badges available in a [**category**](#available-categories) | ```s```, ```find```  | Use arrow keys to scroll up/down.
```mdb lookup <keyword>``` | Displays badges containing a certain keyword. | ```l``` | Also displays what category the badge is in, and clicking ```ENTER``` on a badge will give you the badge code.
```mdb create``` | Displays prompts to create your own badge | ```generate``` | Only hexadecimal colors (e.g #000, #FFFFFF) are supported.
```mdb random``` | Displays a random badge. | ```r``` | Supports both Markdown and HTML formats. Supports specific categories using ```--category``` or ```-c```.
```mdb copy <category> <badgeName>``` | Copies a badges' code to the clipboard | ```c``` | On Windows 11, you can do <kbd>⊞</kbd> <kbd>+</kbd> <kbd>V</kbd> to verify it's been copied.
```mdb badges``` | Opens a link to the badge list in your browser. | ```list``` | Both links will be displayed after a few seconds, in case it does not open in your *(default)* browser.
```mdb add <category> <badgeName> <fileName>``` | Allows you to add a badge to a Markdown file | N/A | **Only ```.md``` files are supported.** Will work in subdirectories, so long as the file path is correct.

# Miscellaneous Commands

|   Command      |    Description    |     Aliases      | Additional Information |
|----------|-----------|---------------------------|--------|
```mdb version``` | Displays the current version you are on | ```v``` | This command is *not* for updating, this simply outputs your version. To update, see below.
```mdb update``` | Automatically updates the package | ```upd```, ```u``` | Running this command with ```--check``` will only check for updates and tell you if an update is available. Running it without that option will automatically run ```npm install -g mdbadges-cli@latest```.
```mdb fund``` | Displays funding/donation links for the package | N/A | You don't have to donate, but I'd appreciate it!
```mdb about``` | Displays general information about the package | ```abt``` | Also shows links to the website, GitHub issues, contributing, and more.
```mdb documentation``` | Opens a link to the documentation in your browser. | ```docs``` | Again, the link will be displayed after a few seconds, in case it does not open in your *(default)* browser.
```mdb changelog``` | Opens a link to the latest release with it's changelogs in your browser. | ```release``` | Once again, the link will be displayed after a few seconds, in case it does not open in your *(default)* browser.

# Available Categories

Below you'll find categories that are currently available, with the name and syntax needed in the ```<category>``` field of certain commands.

| Name | Syntax |
|---------|---------------|
App Store | app-store
Artificial Intelligence | ai
Blog | blog
Browser | browser
Code Coverage | code-coverage
Code Editor | code-editor
Cloud | cloud
Collaboration | collaboration
Crypto | crypto
Database | database
Design | design
Delivery | delivery
Documentation | documentation
Education | education
Funding | funding
Framework | framework
Game Engine | game-engine
Gaming Storefront | game-stores
Jobs | jobs
Office | office
Operating System | os
Package Manager | package-manager
Payment | payment
Programming Language | programming
Restaurant | restaurant
Review | review
Search Engine | search-engine
Social Media | social
Sound | sound
Static Site | static-site
Storage | storage
Video Streaming | video-streaming
Virtual Reality | vr

# Contributing

There are multiple ways to contribute and improve this package.

* [**New Features**](https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md#features "Features" ) - Features/Improvements which improve user experience.
    * See also: [**Styling**](https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md#styling)
* [**Adding Badges**](https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md#adding-badges "Adding Badges") - New badges to be added to the already large list of badges.
* [**Questions**](https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md#adding-badges "Questions") - Questions about the package, which can spiral into new features/improvements/suggestions.
* [**Bugs/Inconsistencies**](https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md#bugsinconsistencies "Bugs/Inconsistencies") - Issues within the package or something that doesn't look right.
    * See also: [**Spellchecking**](https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md#spellchecking)

##### [Read the full contributing guidelines here.](https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md)

---
<div align="center">

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/intter)

###### **©** ```2024``` · [MIT License](http://license.mdbcli.xyz)
