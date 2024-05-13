# Contributing Guidelines

Thank you for considering contributing to this project! Take a moment to read through the guidelines below before making your contribution.

> [!IMPORTANT]
> You must have Node.js 18 or higher installed before contributing.

# Features

If you would like to contribute a new feature, create a new [pull request][Pull Requests], detailing the feature and additional information, such as what it does, and its use case.

For commands, read below.

# Commands

To add a new command using [Commander][Commander]:

  **1.** Navigate to the [main file][index.js] of this package.

  **2.** Define the new command, specifying its name, aliases (optional), a brief description of its purpose, and the command logic itself.

```javascript
// An example command
program
  .command('example')
  .alias('eg')
  .description('an example command for the docs!')
  .action(() => {
    console.log(c.green("This was successful!"));
  });
```

Generally, you should stick to single-word command names without spaces (for example: instead of *'search-badges'*, do *'search'*). 

You should also aim to keep command names, descriptions, and aliases **concise and descriptive** to avoid any confusion.

# Adding Badges

When adding badges to mdbadges-cli, you have a few options in terms of in what ways you can contribute.

### Adding directly to JavaScript

If you want to directly add a badge into this repository, follow the steps below.

**1.** Navigate to the [file][badges.js] where badges are stored and defined from.

**2.** If you are adding a badge to an existing category, locate the relevant category for the badge, and add the badge definition in alphabetical order, like this example below:

```javascript
'social': {
  'deviantart': // ...
  'discord': '[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white)](#) ',
  'facebook': // ...
}
```

`'discord'` — **The definition** of the badge.

`[![Discord]` — **The alternate text** of the badge.

`https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white` — The **badge link**.

`(#)` — The **URL where users will be redirected to** when clicking on the badge.

> [!IMPORTANT]
> When adding a badge, **do not** place a URL within the enclosed hashtags, as this space is reserved for the user to replace with any specific URL that they decide to enter.

### Adding to Markdown file

You can also add a badge to [md-badges][md-badges], which is a list of badges and the main source for every badge within mdbadges-cli. To add them, you can:

* Navigate to the repository for md-badges via the link above.

* Read the [contributing guidelines][md-badges Contributing Guidelines] before contributing.

* Contribute a new badge to the md-badges repository.

When badges are added to md-badges, they will be added accordingly to this package in future releases, usually within a few days of new additions.

# Styling

In mdbadges-cli, three different styling packages are used.

* **ansi-colors** — This is the main coloring package used in mdbadges-cli. To use ansi-colors, use the `c` prefix, followed by the color of choice, which you can see [here][ansi-colors Color Options].

    ```javascript
    // coloring the whole message
    console.log(c.yellow('Hasn\'t opened in your browser? Try clicking on the link below:'));
    console.log(c.magenta(`https://github.com/inttter/${packageInfo.name}/releases/latest`));

   // different colors within the same message
  console.log(c.cyan(`Try running ${c.blue.bold(`mdb search`)} for a full list of badges in this category.`,));

  // template literals with ansi-colors
  name: ${c.green(formattedBadge)} in ${c.yellow(formattedCategory)}
  ```

* `gradient-string` — This is used when prompting the user for something, for example, a text input. Specifically, `gradient.fruit` is used in almost all instances for prompt messages. See this example below:

  ```javascript
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: gradient.fruit('Select a category:'),
      choices: categories.map(formatCategoryName),
      },
    ]);
  ```

* `Chalk` — This is used for badge code outputs, such as this example below:

  ```javascript
  console.log(chalk.hex("#FFBF00")(selectedBadge));
  ```

# Committing

* mdbadges-cli uses [Conventional Commits][Convential Commits] for commit messages, so commit messages should be in this format:

    ```
    chore: remove old code
    ```

* When using emoji in commit messages, [Gitmoji][Gitmoji] is most commonly used, as well as some others (which you can decide what they should be). For example:

    ```
    ✨ feat: add GitHub badge
    ```

For more specific instances, you can include a scope for the commit. A scope is what is in the parenthesis of a commit message. See these examples below for more:

```bash
    # Related to releasing a new version
🔖 chore(release): bump version to 6.0.0

    # Related to a new feature in the update command
✨ feat(update): show update progress bar

    # A bug within the badge definitions which is being fixed
🐛 fix(badges): fix incorrect GitHub badge code
```

---

## Questions

For any questions you have, open an [issue][Create an issue] and label it with the `question` label.

<div align="center">
  <img src="https://github.com/inttter/mdbadges-cli/assets/73017070/6175f030-109b-4931-aa25-7803360ce303" width="250" alt="Question Label">
</div>

## Bugs/Inconsistencies

If you come across any bugs, report them by [creating an issue][Issues]. Provide details on how you encountered the bug, any error messages that may appear, and any potential fixes you might have identified.

## License

By contributing, you agree that your contributions will be licensed under the MIT License, which you can view [here][License].

<!-- Link Definitions -->
[ansi-colors Color Options]: https://github.com/doowb/ansi-colors?tab=readme-ov-file#available-styles
[badges.js]: https://github.com/inttter/mdbadges-cli/blob/main/src/badges.js
[Commander]: https://www.npmjs.com/package/commander
[Convential Commits]: https://www.conventionalcommits.org/en/v1.0.0/
[Create an issue]: https://github.com/inttter/mdbadges-cli/issues/new
[Gitmoji]: https://gitmoji.dev
[index.js]: https://github.com/inttter/mdbadges-cli/blob/main/src/index.js
[Issues]: https://github.com/inttter/mdbadges-cli/issues
[License]: https://github.com/inttter/mdbadges-cli/blob/main/LICENSE
[md-badges]: https://github.com/inttter/md-badges
[md-badges Contributing Guidelines]: https://github.com/inttter/md-badges/blob/main/CONTRIBUTING.md
[Pull Requests]: https://github.com/inttter/mdbadges-cli/pulls