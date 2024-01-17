# Contribtuing Guidelines

Thanks for considering contributing to this project!

However, **please** read below before you do contribute!

# Features
If you would like to contribute a new feature, create a new [pull request](https://github.com/inttter/mdbadges-cli/pulls), detailing the feature and any additional information, such as ```Aliases``` and ```Additional Information```, if it is a command. 

For other features, please describe in as much detail as possible what the feature is and what it does.

# Adding Badges
When adding badges, you have two options to do so.

## 1. Adding directly to JavaScript

If you want to directly add a badge into this repository, follow these steps:

**1.** Go to the ```badges.js``` file in the project directory.

**2a.** If you're adding a badge to an already existing category, simply find the category (for example, **Social Media** is ```social-media ```), and add a badge in this structure, ***in alphabetical order***:

```javascript
'discord': '[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white)](#) ',
```

<div align="center">

###### Please note that this is an example that already exists. When adding new badges, check to make sure they aren't alreadyt added.

</div>

💡 Make sure to replace these with your badge details.

```'discord'``` - **name of the badge** (what users will type when typing the command to find a badge - e.g. "mdb social-media discord")

```[![Discord]``` - alt text

```https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white``` - badge link

```(#)``` - where links will go

> [!IMPORTANT]
> **DO NOT** place anything other than (#) in the section after your link. This is to make the create command support adding custom links.

## 2. Adding to Markdown file

If you want to  add a badge to the list of badges, follow these steps:

**1.** Navigate to [**this repository**](https://github.com/inttter/md-badges).

**2.** Read the [**contributing guidelines**](https://github.com/inttter/md-badges/blob/main/CONTRIBUTING.md).

**3.** Contribute to that repository.

**4.** When badges are added to **md-badges**, they will be added accordingly to this package in future releases.

# Questions
For questions that require answers, open an issue and label it with the ```question``` label.

# Bugs/Inconsistencies
If you come across any bugs, report them by [creating an issue](https://github.com/inttter/mdbadges-cli/issues). Provide details on how you encountered the bug and any potential fixes you might have identified.

For inconsistencies, especially those related to the README, create an issue and include a screenshot highlighting the inconsistency.

# License

By contributing, you agree that your contributions will be licensed under the MIT License, which you can view [here](LICENSE).
