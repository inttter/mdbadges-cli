# Contributing Guidelines

Thank you for considering contributing to this project! Take a moment to read through the guidelines below before making your contribution.

> [!IMPORTANT]
> Node 18 or higher is required.

# Features

If you would like to contribute a new feature, create a new [pull request][Pull Requests], detailing the feature and additional information, such as what it does, and its use case.

For commands, read below.

## Adding Commands

The [**Commander**][Commander] package is used for creating new commands.

To add a new command:

**1.** Navigate to the [```index.js```][index.js] file, where all the commands are written.

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

# Adding Badges

When adding badges, you have two options to do so.

### 1. Adding directly to JavaScript

If you want to directly add a badge into this repository, follow these steps:

**1.** Navigate to the [```badges.js```][badges.js] file, which contains the definitions for the badges.

**2.** If you're adding a badge to an existing category, locate the relevant category for the badge, and add the badge definition in alphabetical order, like this example below:

```javascript
'social': {
  // other badges...
  'discord': '[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white)](#) ',
}
```

```'discord'``` - **Name of the badge** *(what users will type when typing the command to find a badge)*

```[![Discord]``` - **Alt Text** *(preferably, should be the same as the badge name)*

```https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white``` - **Badge Link**

```(#)``` - Where links that redirect to other pages will go

> [!IMPORTANT]
> **DO NOT** place anything other than (#) in the section after your link. This is for the ```mdb create``` command and the ```--link``` option in the main command.

### 2. Adding to Markdown file

If you want to  add a badge to the list of badges, follow these steps:

**1.** Navigate to the [**md-badges repository**][md-badges].

**2.** Read the [**contributing guidelines**][md-badges Contributing Guidelines] before contributing.

**3.** Contribute a new badge to that repository.

**4.** When badges are added to md-badges, they will be added accordingly to this package in future releases.

# Styling

* ```ansi-colors``` is the main coloring package used in mdbadges-cli. Almost all text is colored using the ```c``` prefix. See some examples below:

```javascript
// coloring the whole message
console.log(c.yellow('Hasn\'t opened in your browser? Try clicking on the link below:'));
console.log(c.magenta(`https://github.com/inttter/${packageInfo.name}/releases/latest`));

// different colors within the same message
console.log(c.cyan(`Try running ${c.blue.bold(`mdb search`)} for a full list of badges in this category.`,));

// template literals with ansi-colors
name: ${c.green(formattedBadge)} in ${c.yellow(formattedCategory)}
```

<br>

* ```gradient-string``` is used for prompts to the user. Specifically, ```gradient.fruit``` is used for all prompt messages, such as this example below:

```javascript
const answers = await inquirer.prompt([
  {
    type: 'list',
    name: 'category',
    message: gradient.fruit('Select a category:'), // this will have the gradient
    choices: categories.map(formatCategoryName),
    },
  ]);
```

<br>

* ```Chalk``` is used for badge code outputs, such as this example below:

```javascript
console.log(c.green.bold('Badge found:'));
console.log(chalk.hex("#FFBF00")(selectedBadge)); // this is colored with hex #FFBF00
```

# Committing

* mdbadges-cli uses [Conventional Commits][Convential Commits] for commit messages, so commit messages should be in this format:

    ```
    chore: remove old code
    ```

* [Gitmoji][Gitmoji] is used for (most) commit emoji's, as well as some others (which you can decide what they should be). For example:

    ```
    ✨ feat: add GitHub badge
    ```

For more specific things, you can do something like the following examples below:

```
🔖 chore(release): bump version to 6.0.0

✨ feat(update): show update progress bar

🐛 fix(badges): fix incorrect GitHub badge code
```

---

## Questions

For any questions you have, open an issue and label it with the ```question``` label.

<div align="center">

<img src="https://github.com/inttter/mdbadges-cli/assets/73017070/6175f030-109b-4931-aa25-7803360ce303" width="250" alt="Question Label">

</div>

## Bugs/Inconsistencies

If you come across any bugs, report them by [creating an issue][Issues]. Provide details on how you encountered the bug, any error messages that may appear, and any potential fixes you might have identified.

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License, which you can view [here][License].

<!-- Link Definitions -->
[md-badges]: https://github.com/inttter/md-badges
[md-badges Contributing Guidelines]: https://github.com/inttter/md-badges/blob/main/CONTRIBUTING.md
[Pull Requests]: https://github.com/inttter/mdbadges-cli/pulls
[Issues]: https://github.com/inttter/mdbadges-cli/issues
[License]: https://github.com/inttter/mdbadges-cli/blob/main/LICENSE

[index.js]: https://github.com/inttter/mdbadges-cli/blob/main/src/index.js
[badges.js]: https://github.com/inttter/mdbadges-cli/blob/main/src/badges.js

[Commander]: https://www.npmjs.com/package/commander
[Convential Commits]: https://www.conventionalcommits.org/en/v1.0.0/
[Gitmoji]: https://gitmoji.dev