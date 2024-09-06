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

mdbadges-cli uses [Commander][] for commands. In order to add a new command, follow the steps outlined below:

**1.** Navigate to the [main file][index.js] where all of the commands are stored in.

**2.** Define the new command, specifying its **name**, **aliases** (optional), a brief **description** of its purpose, and the command logic itself.

```js
program
  .command('example')
  .alias('eg')
  .alias('ex')
  .description('An example description for the docs.')
  .action(() => {
    // ...put your command logic here...
    console.log(c.cyan('Something happened here.'));
  });
```

Generally, you should stick to single-word command names without spaces. For example, instead of naming the command **'command-name'**, name it **'command'**.

Aim to keep command names and descriptions **concise and descriptive** to avoid any confusion to users.

# Adding Badges

Before you contribute a new badge, make sure that you have checked for the following:

* Badge is not a **duplicate**
* Badge is in the **correct category**
* Badge is listed in the category in **alphabetical order**
* Badge image appears **without any issues**
* Badge code works **without any issues**
* [Badge has a **logo**](https://github.com/inttter/md-badges/blob/main/CONTRIBUTING.md#user-content-fn-1-7455704da16e59664b2a5ce032cc704a)
* Badge follows the **correct format**

Once you have verified all of the above, you have two ways that you can add badges.

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

`https://img.shields.io/badge/...` is the **badge link**.

`(#)` is the URL where **users will be redirected to** when clicking on the badge. Make sure this stays as (#), and do not add your own links within this part.

> [!IMPORTANT]
> Make sure that your badge uses the correct format (as shown above) in order for it to pass the [badge validation test][].
>
> You can check if your badge passes the test by running:
>
> ```bash
> npm run test
> ```

If you are adding a new category, ensure it the category is placed in **alphabetical order** as well, and update the [table in the README](README.md#categories) with the name and syntax of the category.

### Adding to Markdown file

You can also add a badge to [md-badges][], where every badge you can use within mdbadges-cli comes from. To add it, you can:

* Navigate to the repository for md-badges via the link above.

* Read the [contributing guidelines][md-badges Contributing Guidelines] before contributing.

* Contribute a new badge to that repository.

When badges are added to md-badges, they will be added accordingly to this package in future releases, usually within a few days or weeks of new additions.

# Styling

In mdbadges-cli, `Chalk` is the main coloring package that is used. To use Chalk, use the `c` prefix, followed by the color of choice, which you can see [here][Chalk Color Options].

  ```javascript
  // Examples
  console.log(c.green.bold('\nBadge found:'));
  console.log(c.hex('#FFBF00').bold(`${selectedBadge}\n`));
  ```

While there are no set colors you should or should not use, aim to keep consistency with the colors of other commands.

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

These commit messages will also be used in release changelogs.

## Questions

For any questions you have, [create an issue][] and label it with the `question` label.

Before you ask your question, you should check to see whether it has already been answered, and what you haven't tried/thought about.

## Bugs/Inconsistencies

If you come across any bugs, make an [issue report][] to report them.

You should provide details on **how you encountered the issue**, any **error messages** or **terminal outputs** you see, **screenshots** (if applicable) and, if you know one, what you believe is **a plausible fix** for the issue.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License][].

<!-- Link Definitions -->

[badge validation test]: https://github.com/inttter/mdbadges-cli/blob/main/tests/validate.test.js
[badges.js]: https://github.com/inttter/mdbadges-cli/blob/main/src/badges.mjs
[Chalk Color Options]: https://github.com/chalk/chalk?tab=readme-ov-file#styles
[Commander]: https://www.npmjs.com/package/commander
[Conventional Commits]: https://www.conventionalcommits.org/en/v1.0.0/
[create an issue]: https://github.com/inttter/mdbadges-cli/issues
[Git]: https://git-scm.com
[Gitmoji]: https://gitmoji.dev
[index.js]: https://github.com/inttter/mdbadges-cli/blob/main/src/index.mjs
[issue report]: https://github.com/inttter/mdbadges-cli/issues/new?assignees=&labels=bug&projects=inttter%2Fmdbadges-cli&template=02-issue-report.yml&title=%5BBug%5D%3A+
[md-badges]: https://github.com/inttter/md-badges
[md-badges Contributing Guidelines]: https://github.com/inttter/md-badges/blob/main/CONTRIBUTING.md
[MIT License]: https://github.com/inttter/mdbadges-cli/blob/main/LICENSE