# Contribtuing Guidelines

Thanks for considering contributing to this project!

However, **please** read below before you do contribute!

---

# Features
If you would like to contribute a new feature, create a new [pull request](https://github.com/inttter/mdbadges-cli/pulls), detailing the feature and any additional information, such as ```Aliases``` and ```Additional Information```, if it is a command. 

For other features, please describe in as much detail as possible what the feature is and what it does.

## Adding Commands

[**Commander**](https://www.npmjs.com/package/commander) is used for creating new commands.

Navigate to the ```/src/index.js``` file.

> [!IMPORTANT]
> Make sure you place any new code ***above*** this line, or else it will **not** work.

```javascript
program.parse(process.argv);
```


Here's a starting template for a command:

```javascript
  program
  .command('<command name here>')
  .alias('<shorter version of name here>') // can be more than one
  .description('<short description of the command here>')
  .action(async () => {   // add your command's logic after this
  // you don't HAVE to use async, you can use a different action
```

Using this, you should be able to create a command. Here's an example of a very simple version comamnd:

```javascript
program
  .command("version") // command name
  .alias("ver") // shorter version of command name
  .alias("v") // shorter version of command name
  .description("Displays the current version you are on.") // description of the command
  .action(() => { // anything below here is the command
    console.log();
    console.log(gradient.cristal(`${packageInfo.version}`)); // fetches package info version
    console.log();
  });
```

You can add commands in any place, but preferably at the bottom, after the last command, for easier maintainability.

---

# Adding Badges

When adding badges, you have two options to do so.

### 1. Adding directly to JavaScript

If you want to directly add a badge into this repository, follow these steps:

**1.** Navigate to the ```/src/badges.js``` file. 

**2.** If you're adding a badge to an already existing category, simply find the category (for example, **Social Media** is ```social-media```), and add a badge in this structure, ***in alphabetical order***:

```javascript
'discord': '[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white)](#) ',
```

<div align="center">

###### Please note that this is an example that already exists. When adding new badges, check to make sure they aren't alreadyt added.

</div>

> [!NOTE]
> Make sure to replace these with your badge details.

```'discord'``` - **Name of the badge** (what users will type when typing the command to find a badge)

```[![Discord]``` - Alt Text (preferably, should be the same as the badge name)

```https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white``` - badge link

```(#)``` - where links will go

> [!IMPORTANT]
> **DO NOT** place anything other than (#) in the section after your link. This is for the ```mdb create``` command and the ```--link``` option in the main command.

### 2. Adding to Markdown file

If you want to  add a badge to the list of badges, follow these steps:

**1.** Navigate to the [**md-badges repository**](https://github.com/inttter/md-badges).

**2.** Read the [**contributing guidelines**](https://github.com/inttter/md-badges/blob/main/CONTRIBUTING.md) before contributing.

**3.** Contribute a new badge to that repository.

**4.** When badges are added to **md-badges**, they will be added accordingly to this package in future releases.

---

## Questions

For questions that require answers, open an issue and label it with the ```question``` label.

<div align="center">

<img src="https://github.com/inttter/mdbadges-cli/assets/73017070/6175f030-109b-4931-aa25-7803360ce303" width="250" alt="Question Label">

</div>

## Bugs/Inconsistencies

If you come across any bugs, report them by [creating an issue](https://github.com/inttter/mdbadges-cli/issues). Provide details on how you encountered the bug and any potential fixes you might have identified.

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License, which you can view [here](LICENSE).
