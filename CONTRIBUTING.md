# Contributing Guidelines

Thank you for considering contributing to this project! Take a moment to read through the guidelines below before making your contribution.

> [!IMPORTANT]
> Node 18 or higher is required.

---

# Features

If you would like to contribute a new feature, create a new [pull request](https://github.com/inttter/mdbadges-cli/pulls), detailing the feature and additional information, such as what it does, and its use case.

For commands, read below.

## Adding Commands

The [**Commander**](https://www.npmjs.com/package/commander) package is used for creating new commands.

To add a new command:

**1.** Navigate to the ```/src/index.js``` file, where all the commands are written.

> [!IMPORTANT]
Ensure that any new command code is placed above this line to ensure proper functionality:
> ```javascript
> program.parse(process.argv);
> ```

**2.** Define the new command, specifying its name, aliases (optional), a brief description of its purpose, and the command logic itself.

You can view an example command below:

```javascript
  program
  .command('example')
  .alias('ex') // can be more than one
  .description('Outputs some text in different styles.')
  .action(async () => { // command logic goes below
   // note: you can use a different action
    console.log(gradient.cristal("This will be outputted with a gradient!"));
    console.log(chalk.hex('#FFBF00')("This will be outputted with the hex color!"));
    console.log(c.yellow.underline("This will be outputted in yellow, while being underlined!"))
  });
```

> [!NOTE]
> It is recommended to use single-word command names without spaces (e.g. instead of ```search-badges```, do ```search```). **Aim to keep command names concise and descriptive.**

While commands can be added anywhere within the file, it's recommended to place them at the bottom of the file *(but above the process.argv line)*. This arrangement makes it easier to manage and update commands in the future.

---

# Adding Badges

When adding badges, you have two options to do so.

### 1. Adding directly to JavaScript

If you want to directly add a badge into this repository, follow these steps:

**1.** Navigate to the ```/src/badges.js``` file, which contains the definitions for the badges.

**2.** If adding a badge to an existing category, locate the relevant category for the badge, and add the badge definition in alphabetical order, like this example below:

```javascript
'discord': '[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white)](#) ',
```

```'discord'``` - **Name of the badge** *(what users will type when typing the command to find a badge)*

```[![Discord]``` - **Alt Text** *(preferably, should be the same as the badge name)*

```https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white``` - **Badge Link**

```(#)``` - Where links that redirect to other pages will go

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

Currently, [**```gradient-string```**](https://github.com/bokub/gradient-string), [**```Chalk```**](https://github.com/chalk/chalk), and [**```ansi-colors```**](https://github.com/doowb/ansi-colors) are used for styling the text.

To maintain consistency in styling, consider including at least one of these.

### Syntax:

```javascript
// gradient-string example
console.log(gradient.cristal("This will be outputted with a gradient!"))

// Chalk (CommonJS) example
console.log(chalk.hex('#FFBF00')("This will be outputted with the hex color!"))

// ansi-colors example
console.log(c.yellow.underline("This will be outputted in yellow, while being underlined!"))
```

### Example Use Case:

<div align="center">

<img src="https://github.com/inttter/mdbadges-cli/assets/73017070/be0f7d7f-1ab5-4022-95d2-f9a89c9f1757" width="500">

</div>

### Output:

<div align="center">

<img src="https://github.com/inttter/mdbadges-cli/assets/73017070/0d51b39b-883e-4a71-bfe3-478364f22bcb" width="500">

</div>

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
| <img src="https://github.com/inttter/mdbadges-cli/assets/73017070/b9ae506e-8cbb-4632-8eb2-4055e8435b91" width="750"> | <img src="https://github.com/inttter/mdbadges-cli/assets/73017070/d67e0a58-1e40-42ea-a835-e6531b88c7ca" width="650"> |

> [!NOTE]
> In certain cases, the workflow may fail. For example, if I removed `"shieldsio",` from the `words` category in the config file, the workflow will fail, and the following will appear:
>
> ```bash
> ~ cspell '**/*.md'
>
> ... # other files...
>
> 2/3 .\CONTRIBUTING.md 45.50ms X
> .\CONTRIBUTING.md:141:74 - Unknown word (shieldsio) 
>
> ... # other files...
>
> CSpell: Files checked: 3, Issues found: 1 in 1 file
> ```
>
> In the case above, if it is not a typo and it is, in fact, a correct word/phrase/etc., you can add it to the `words` category in `cspell.json`. After doing this, you can commit this change to your branch, and the workflow should run without problems.

---

## Questions

For any questions you have, open an issue and label it with the ```question``` label.

<div align="center">

<img src="https://github.com/inttter/mdbadges-cli/assets/73017070/6175f030-109b-4931-aa25-7803360ce303" width="250" alt="Question Label">

</div>

## Bugs/Inconsistencies

If you come across any bugs, report them by [creating an issue](https://github.com/inttter/mdbadges-cli/issues). Provide details on how you encountered the bug, any error messages that may appear, and any potential fixes you might have identified.

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License, which you can view [here](http://license.mdbcli.xyz).
