# Contributing Guidelines

Thank you for considering contributing to this project! Take a moment to read through the guidelines below before making your contribution.

> [!IMPORTANT]
> You must have Node.js 18 or higher installed before contributing.

# Installing locally

You will need to have a local copy of the repository.

To do this, fork the project locally by clicking the '**Fork**' button at the top of the repository to create a fork of mdbadges-cli to your GitHub account.

You'll then need to clone it on your local machine. In order to do this, make sure you have [Git][] installed, then run the following commands:

```bash
# Replace 'YOUR-USERNAME' with your GitHub username
git clone https://github.com/YOUR-USERNAME/mdbadges-cli.git
cd mdbadges-cli
```

Create a branch to work on your changes by running these commands:

```bash
# Replace '[NAME]' with the name of your branch
git branch [NAME]
git checkout [NAME]
```

You can now start making your change. Once you are ready to to commit your changes and push them to remote, run:

```bash
git add .
git checkout -m "✨ feat: [commit message here]"
git push
```

> When writing commit messages, make sure to follow the [Conventional Commits][] guidelines. If you would like, you can use [Gitmoji][] as well for commit emojis.

You can now create a pull request with your changes.

# Commands

mdbadges-cli uses [Commander][] for its commands. In order to add a new command, follow the steps outlined below:

**1.** Navigate to the [main file][index.js] where all of the commands are stored in.

**2.** Define the new command, specifying its name, aliases _(optional)_, a brief description of its purpose, and the command logic itself.

```javascript
// An example command
program
  .command('example')
  .alias('eg')
  .description('an example command for the docs!')
  .action(() => {
    // ...do something
    console.log(c.green("This is an example!"));
  });
```

Generally, you should stick to single-word command names without spaces. For example: instead of *'search-badges'*, do *'search'*.

You should also aim to keep command names, descriptions, and aliases **concise and descriptive** to avoid any confusion.

# Adding Badges

<details>
  <summary><strong>
  ⚠️ Disclaimer about logos in badges, click to read: ⚠️ 
  </strong></summary>
  
  <br />

  Badges added to `mdbadges-cli` **must** have a valid logo associated with the badge:

  | ❌ Invalid badge | ✅ [Valid](https://simpleicons.org/?q=neovim) badge |
  | ------------------------------ | --------------------------------------------------------------- |
  | `[![Edge](https://img.shields.io/badge/Edge-0078D7?logo=Microsoft-edge&logoColor=white)](#)` | `[![Neovim](https://img.shields.io/badge/Neovim-57A143?logo=neovim&logoColor=fff)](#)` |
  | <div align="center">[![Edge](https://img.shields.io/badge/Edge-0078D7?logo=Microsoft-edge&logoColor=white)](#)</div> | <div align="center">[![Neovim](https://img.shields.io/badge/Neovim-57A143?logo=neovim&logoColor=fff)](#)</div> |

  Before you add a badge, make sure that it has a logo associated with it on [SimpleIcons](https://simpleicons.org/).

  If it does not, you can use [custom-icon-badges](https://custom-icon-badges.demolab.com/), along with a custom image (preferably in an appropriate color) and switch the URL from `https://img.shields.io` to `https://custom-icon-badges.demolab.com`, and adjust the `logo=` field to use your custom slug.

  | Before | After |
  | ------------------------------ | --------------------------------------------------------------- |
  | `[![C#](https://img.shields.io/badge/C%23-%23239120.svg?logo=csharp&logoColor=white)](#)` | `[![C#](https://custom-icon-badges.demolab.com/badge/C%23-%23239120.svg?logo=cshrp&logoColor=white)](#)` |
  | <div align="center">[![C#](https://img.shields.io/badge/C%23-%23239120.svg?logo=csharp&logoColor=white)](#)</div> | <div align="center">[![C#](https://custom-icon-badges.demolab.com/badge/C%23-%23239120.svg?logo=cshrp&logoColor=white)](#)</div> |
</details>

You have two options in terms of in what ways you can add badges.

### Adding directly to JavaScript

If you want to directly add a badge into this repository, follow the steps below.

**1.** Navigate to the [file][badges.js] where badges are stored and defined in.

**2.** If you are adding a badge to an existing category, locate the relevant category for the badge, and add the definition for the badge in **alphabetical order**, like this example below:

```javascript
'social': {
  'deviantart': // ...
  'discord': '[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white)](#) ',
  'facebook': // ...
}
```

`'discord'` is the **definition** of the badge.

`[![Discord]` is the **alternate text** of the badge.

`https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white` is the **badge link**.

`(#)` is the URL where **users will be redirected to** when clicking on the badge. Make sure this stays as (#), and do not add your own links within this part.

> [!IMPORTANT]
> Make sure that your badge uses the correct format (as shown above) in order for it to pass the [badge validation test][].
>
> You can check if your badge passes the test by running:
>
> ```bash
> npm run test
> ```

### Adding to Markdown file

You can also add a badge to [md-badges][], which is a list of badges and the main source for every badge within mdbadges-cli. To add them, you can:

* Navigate to the repository for md-badges via the link above.

* Read the [contributing guidelines][md-badges Contributing Guidelines] before contributing.

* Contribute a new badge to the md-badges repository.

When badges are added to md-badges, they will be added accordingly to this package in future releases, usually within a few days of new additions.

# Styling

In mdbadges-cli, `Chalk` is the main coloring package that is used. To use Chalk, use the `c` prefix, followed by the color of choice, which you can see [here][Chalk Color Options].

  ```javascript
  // Examples
  console.log(c.green.bold('\nBadge found:'));
  console.log(c.hex('#FFBF00').bold(`${selectedBadge}\n`));
  ```

# Committing

* mdbadges-cli uses [Conventional Commits][] for commit messages, so commit messages should be in this format:

    ```
    <type>[optional scope]: <description>
    ```

* If you would like to also use emoji in your commit messages, you should try to adhere to the [Gitmoji][] emoji's, as they are most commonly used, as well as other miscellaneous emoji's, which you can decide on what they should be represented by. For example:

    ```
    ✨ feat: add GitHub badge
    ```

For more specific instances, you can include a **scope** for the commit. A scope is what is in the parenthesis of a commit message. This is helpful in instances where you are making changes to a certain section of the package. See these examples below:

```bash
    # Related to releasing a new version
🔖 chore(release): bump version to 6.0.0

    # Related to a new feature in the update command
✨ feat(update): show update progress bar

    # A bug within the badge definitions which is being fixed
🐛 fix(badges): fix incorrect GitHub badge code
```

## Questions

For any questions you have, [create an issue][] and label it with the `question` label.

Before you ask your question, you should consider whether it has already been answered, and what haven't tried/thought about.

## Bugs/Inconsistencies

If you come across any bugs, [create an issue][] to report them.

You should provide details on **how you encountered the issue**, any **error messages** you may have received, **screenshots** (if applicable) and, if you find one, what you believe is **a plausible fix** for the issue.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License][].

<!-- Link Definitions -->

[badge validation test]: https://github.com/inttter/mdbadges-cli/blob/main/tests/validate.test.js
[badges.js]: https://github.com/inttter/mdbadges-cli/blob/main/src/badges.mjs
[Chalk Color Options]: https://github.com/chalk/chalk?tab=readme-ov-file#styles
[Commander]: https://www.npmjs.com/package/commander
[Conventional Commits]: https://www.conventionalcommits.org/en/v1.0.0/
[create an issue]: https://github.com/inttter/mdbadges-cli/issues
[custom-icon-badges]: https://custom-icon-badges.demolab.com
[Git]: https://git-scm.com
[Gitmoji]: https://gitmoji.dev
[index.js]: https://github.com/inttter/mdbadges-cli/blob/main/src/index.mjs
[md-badges]: https://github.com/inttter/md-badges
[md-badges Contributing Guidelines]: https://github.com/inttter/md-badges/blob/main/CONTRIBUTING.md
[MIT License]: https://github.com/inttter/mdbadges-cli/blob/main/LICENSE
[SimpleIcons]: https://simpleicons.org
