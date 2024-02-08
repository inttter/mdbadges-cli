# Contributing Guidelines

Thanks for considering contributing to this project!

However, **please** read below before you do contribute!

> [!IMPORTANT]
> Versions past **v4.4.2** require [**Node 18**](https://nodejs.org/en/blog/release/v18.0.0) or higher, due to [**Commander now requiring Node 18 or higher.**](https://github.com/tj/commander.js/releases/tag/v12.0.0)  Please make sure you have a compatible version before installing or contributing.

---

# Features
If you would like to contribute a new feature, create a new [pull request](https://github.com/inttter/mdbadges-cli/pulls), detailing the feature and any additional information, such as ```Aliases``` and ```Additional Information```, if it is a command. 

For other features, please describe in as much detail as possible what the feature is and what it does.

## Adding Commands

[**Commander**](https://www.npmjs.com/package/commander) is used for creating new commands.

Navigate to the ```/src/index.js``` file.

> [!IMPORTANT]
> Make sure you place any new code ***above*** this line, or else it will **not** work.
> ```javascript
> program.parse(process.argv);
> ```


Here's a starting template for a command:

```javascript
  program
  .command('<command name here>')
  .alias('<shorter version of name here>') // can be more than one
  .description('<short description of the command here>')
  .action(async () => {   // add your command's logic after this
  // you don't HAVE to use async, you can use a different action
```

Using this, you should be able to create a command. Here's an example of a very simple version command:

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

###### Please note that this is an example that already exists. When adding new badges, check to make sure they aren't already added.

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

# Styling

Currently, we use [**```gradient-string```**](https://github.com/bokub/gradient-string), [**```Chalk V4```**](https://github.com/chalk/chalk), and [**```ansi-colors```**](https://github.com/doowb/ansi-colors) for styling/coloring the text.

Preferably, you should include at least one of these.

> [!NOTE]
> We use Chalk 4.1.2 because that is the last CommonJS version.

### Syntax:

```javascript
// gradient-string example
console.log(gradient.cristal("This will be outputted with a gradient!"))

// Chalk 4.1.2 example
console.log(chalk.hex('#FFBF00')("This will be outputted with the hex color!"))

// ansi-colors example
console.log(c.yellow.underline("This will be outputted in yellow, while being underlined!"))
```

---

## Spellchecking

> [!NOTE]
> This also applies to the [**Spellcheck (JavaScript**)](https://github.com/inttter/mdbadges-cli/blob/main/.github/workflows/spellcheck-js.yml) workflow.

```cspell``` is used for spell-checking Markdown files. There's a workflow within this repository which checks for spelling errors after any push/pull request to a Markdown file, which you can see [**here**](https://github.com/inttter/mdbadges-cli/blob/main/.github/workflows/spellcheck.yml).

You can see the ```cspell``` config in the ```cspell.json``` file [**here**](https://github.com/inttter/mdbadges-cli/blob/main/cspell.json).

To avoid any spelling errors when writing new documentation/code, it's recommended to run this command:

```bash
cspell '**'
```

This will check for spelling mistakes in most files. If you spot any extra spelling mistakes outside of the file you're editing, you are free to edit those too!

Here's an example of two scenarios:

|    ```cspell``` ***spotting*** spelling mistakes                              | ```cspell``` finding ***no mistakes***                                   |
|------------------------------------------|----------------------------------------------|
| <img src="https://github.com/inttter/mdbadges-cli/assets/73017070/26f2a327-ac29-4bc3-8fd6-42f8aaf89fc8" width="750"> | <img src="https://github.com/inttter/mdbadges-cli/assets/73017070/4951ecda-f899-4d87-ba78-6ddb284537f0" width="650"> |

> [!NOTE]
> In certain cases, the workflow may fail. For example, if I removed `"shieldsio",` from the `words` category in the config file, the workflow will fail, and the following will appear:
>
> ```bash
> ~ cspell '**/*.md'
>
> 1/3 .\CODE_OF_CONDUCT.md 240.94ms
> 2/3 .\CONTRIBUTING.md 45.50ms X
> .\CONTRIBUTING.md:141:74 - Unknown word (shieldsio) 
> 3/3 .\README.md 78.58ms
> CSpell: Files checked: 3, Issues found: 1 in 1 file
> ```
>
> In the case above, if it is not a typo and it is, in fact, a correct word/phrase/etc., you can add it to the `words` category in `cspell.json`. After doing this, you can commit this change to your branch, and the workflow should run without problems.

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
