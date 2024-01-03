<div align="center">

<img src="assets/logo.png" width="150">

# mdbadges-cli

A command line tool to find Shields.io badges.

</div>

# Installation

To install the latest version via NPM, do:

```
npm install mdbadges-cli@latest
```

# Usage: 

### To find a badge:

```
mdb <category> <badgeName>

e.g: mdb browser firefox
```

If a badge is found in that category, it will output the required Markdown.

### To search for badges in a specific category:

```
mdb search <category>

e.g: mdb search browser
```

This command will display the badges available in that category, and you can then type the command above with a valid category and badge name to display the Markdown.

### To view the full list of badges from the command line, do:

```
mdb badges
```

Alternatively, you can visit the following two links without doing the command:

https://github.com/inttter/md-badges
https://docs.inttter.com/content/badges

### To check for updates:

```
mdb update
```

This command uses Axios to determine if your package version is out-of-date.


# List of available categories:

Below you'll find categories that are currently available, with the name and syntax needed in these commands for the `<category>` section:

```
mdb <category> <badgeName>
```
or:
```
mdb search <category>
```


| Name | Syntax |
|---------|---------------|
App Stores | app-store
Artificial Intelligence | artificial-intelligence
Blog | blog
Browser | browser
Cloud Storage | cloud-storage
Cloud System | cloud-system
Code Coverage | code-coverage
Collaboration Tools | collaboration-tools
Cryptocurrency | cryptocurrency
Database | database
Design | design
Documentation | documentation
Education | education
Funding | funding
Framework | framework
Game Engine | game-engine
Gaming Storefronts | gaming-storefront
Game Engine | game-engine
IDE/Code Editor | ide-code-editor
Office | office
Operating System | operating-system
Package Manager | package_manager
Payment | payment
Programming Language | programming-language
Restaurant/Delivery | restaurant-and-delivery
Search Engine | search-engine
Social Media | social-media
Sound | sound
Static Site | static-site
Video Streaming | video-streaming
Virtual Reality | virtual-reality
Web Technology | web-technology
Work/Jobs | work-and-jobs

###### ©️ Licensed under the [MIT License](LICENSE)