#!/usr/bin/env node

const { program } = require("commander");
const axios = require("axios");
const chalk = require("chalk");
const clipboardy = require("clipboardy");
const ora = require("ora");
const gradient = require("gradient-string");
const inquirer = require("inquirer");
const open = require("open");
const boxen = require("boxen");
const execa = require('execa');
const c = require('ansi-colors');
const { consola } = require("consola");
const cliSpinners = require("cli-spinners")
const fs = require("fs");
const badges = require("./badges");
const utils = require("./utils");
const packageInfo = require("../package.json");

// Functions (see /src/utils.js)
const {
  formatCategoryName,
  searchCategory,
  formatBadgeName,
  escapeHtml,
} = utils;

program.version(packageInfo.version);

// Main Command
program
  .name("mdb") // name = prefix
  .arguments("[category] [badgeNames...]")
  .usage("[category] [badgeNames] [--options]")
  .option("--html", "toggle HTML version of a badge")
  .option("-s, --style <badgeStyle>", "toggle style of a badge")
  .option("--link", "toggle links in a badge")
  .action(async (category, badgeNames = [], options) => {
    const formattedCategory = utils.formatCategoryName(category);
    const categoryData = badges[utils.searchCategory(category)];

    if (categoryData) {
      console.log();

      const links = [];
      let badgesFound = false;

      for (let index = 0; index < badgeNames.length; index++) {
        const badgeName = badgeNames[index];
        const formattedBadgeName = badgeName.toLowerCase();
        const foundBadge = Object.keys(categoryData).find(
          (key) => key.toLowerCase() === formattedBadgeName,
        );
        const badge = categoryData[foundBadge];

        if (badge) {
          badgesFound = true;
          // Prompt for the link only if --link is specified
          let link = "";
          if (options.link) {
            const linkResponse = await inquirer.prompt({
              type: "text",
              name: "link",
              message: badgeNames.length === 1 ? gradient.fruit("Enter your link here:") : index === 0 ? gradient.fruit("▲ Enter your first link here, then click Enter and type the rest below:") : "",
              validate: (value) => {
                return value.trim() === '' ? c.red("Please enter a link.") : true; 
              },
            });
            link = linkResponse.link;
            links.push(link);
          }
        } else {
          // Note: don't use new Error() here because we display similar badges and this will 
          // clog up that prompt and could hide the actual error
          consola.error(c.red(`'${formatBadgeName(badgeName)}' is not a valid badge.`));
          console.log(c.cyan(`Try running ${c.magenta.bold('mdb search')} and selecting '${c.magenta.bold(formattedCategory)}' for a list of badges in that category.\n`));        
          // prompt for similar badges in the same category if it cant find the badge
          const similarBadges = Object.keys(categoryData).filter(key =>
            key.toLowerCase().includes(badgeName.toLowerCase())
          );
        
          // similar badge prompt/logic
          if (similarBadges.length > 0) {
            inquirer.prompt([
              {
                type: "list",
                name: "selectedBadge",
                message: gradient.fruit("Did you mean one of these?"),
                choices: [
                  ...similarBadges.map(similarBadge => ({
                    name: similarBadge,
                    value: categoryData[similarBadge],
                  })),
                  new inquirer.Separator(),
                  {
                    name: 'None of these',
                    value: 'none',
                  }
                ],
              },
            ])
            .then(({ selectedBadge }) => {
              if (selectedBadge === 'none') {
                process.exit(0);
              } else {
                console.log(c.green.bold('\nBadge found:'));
                console.log(chalk.hex("#FFBF00").bold(`${selectedBadge}\n`));
              }
            });
          }
        }
      }

      if (badgesFound) {
        console.log(c.green.bold(`Badge found:`));
      }

      for (let index = 0; index < badgeNames.length; index++) {
        const badgeName = badgeNames[index];
        const formattedBadgeName = badgeName.toLowerCase();
        const foundBadge = Object.keys(categoryData).find(
          (key) => key.toLowerCase() === formattedBadgeName,
        );
        const badge = categoryData[foundBadge];
      
        if (badge) {
          if (options.html) { // --html
            // extracts the badge link and its name
            const badgeLinkMatch = badge.match(/\(([^)]+)\)/);
            const badgeAltMatch = badge.match(/\[([^)]+)\]/);
      
            if (badgeLinkMatch && badgeAltMatch) {
              const badgeLink = badgeLinkMatch[1];
              const badgeAlt = badgeAltMatch[1];
              
              let styleOption = "";
              if (options.style) {
                styleOption = `&style=${options.style}`;
              }
      
              const htmlBadge = `<a href="${escapeHtml(links[index])}">\n  <img src="${badgeLink}${styleOption}" alt="${escapeHtml(badgeAlt)}">\n</a>`;
              console.log(chalk.hex("#FFBF00")(`${htmlBadge}\n`));
            } else {
              consola.error(new Error(c.red("Could not extract badge link or alt text.")));
            }
          } else {
            let badgeStyle = "flat"; // flat is the default style if one is not specified
            if (options.style) {
                // provided style must match one of these styles
                const styles = [
                    "flat",
                    "flat-square",
                    "plastic",
                    "social",
                    "for-the-badge",
                ];
                if (styles.includes(options.style)) {
                    badgeStyle = options.style;
                } else {
                    consola.warn(c.yellow("An invalid style was detected. View available styles here: https://docs.mdbcli.xyz/commands/finding-a-badge#style-s"));
                }
            }
            const styleOption = options.style ? `&style=${options.style}` : ""; // adds style option if one is provided
            const badgeLink = badge.match(/\(([^)]+)\)/)[1];
            const badgeAlt = badge.match(/\[([^)]+)\]/)[1];
            const link = links[index] ? escapeHtml(links[index]) : "#"; // use "#" if link is not provided
        
            const badgeMarkdown = `[${badgeAlt}](${badgeLink}${styleOption})](${link})`;
        
            console.log(chalk.hex("#FFBF00").bold(`${badgeMarkdown}\n`));
        }
        }
      }
    } else {
      consola.error(c.red(`'${category}' is not a valid category.`));
      console.log(c.cyan(`Visit ${c.magenta.bold('https://tinyurl.com/mdbcategories')} for a list of available categories.`));
    }
  });

// Version Command
program
  .command("version")
  .alias("ver")
  .alias("v")
  .description("display the current version you are on")
  .action(() => {
    console.log(c.white(`${packageInfo.version}`)); // fetches package info version from package.json
  });

// Badge List Command
  program
  .command("badges")
  .alias("list")
  .description("open a link to the badge list in your browser")
  .action(async () => {
    console.log()
    const spinner = ora({
      text: c.blue("Opening in browser..."),
      spinner: cliSpinners.arc,
      color: "magenta",
    }).start();

    const listLink = 'https://github.com/inttter/md-badges?tab=readme-ov-file#-table-of-contents'

    try {
      await open(listLink);
      spinner.succeed(c.green("Opened in your browser!"));
    } catch (error) {
      consola.error(new Error(c.red(`An error occurred when trying to open the link in your browser: ${error.message}`)));
      console.log(c.cyan(`\n  You can visit the page by clicking on the following link instead: ${c.magenta.bold(listLink)}`))
      spinner.stop()
    }
  });

  program
  .command('update')
  .alias('upd')
  .alias('u')
  .description('automatically update the package')
  .action(async () => {
    const spinner = ora({
      text: chalk.blue('Checking for updates...'),
      spinner: cliSpinners.arc,
      color: 'magenta',
    }).start();

    try {
      const response = await axios.get(`https://registry.npmjs.org/${packageInfo.name}`);
      const latest = response.data['dist-tags'].latest;
      const [currentMajor, ,] = packageInfo.version.split('.');
      const [latestMajor, ,] = latest.split('.');

      spinner.stop();
      

      if (latest > packageInfo.version) {
        const updateMessage = boxen(
          `An update is available: ${c.dim(packageInfo.version)} ➜  ${c.green(latest)}\nRun ${c.cyan('mdb changelog')} for the changes.${latestMajor > currentMajor ? `\n\n${c.yellow.bold('Warning:')} \n ${c.magenta.bold('This is a major version bump, which may include ')}${c.magenta.underline.bold('breaking changes')} ${c.magenta.bold('that aren\'t backwards compatible.')}\n ${c.magenta.bold('Visit the GitHub page for more details:')} ${c.yellow.bold(`https://github.com/inttter/${packageInfo.name}/releases/tag/${latest}`)}` : ''}`,
          { borderStyle: 'round', padding: 1, margin: 1, title: '🔔 Note', titleAlignment: 'center', borderColor: 'cyan' }
        );
        console.log(updateMessage);

        const { confirm } = await inquirer.prompt({
          type: 'confirm',
          name: 'confirm',
          message: gradient.fruit('Are you sure you want to update now?'),
        });

        if (confirm) {
          const updateSpinner = ora({ text: chalk.cyan('Updating...\n\n'), spinner: cliSpinners.arc }).start();

          try {
            await execa.command(`npm install -g ${packageInfo.name}@latest`, { stdio: 'inherit' });

            updateSpinner.succeed(chalk.green('Update complete!'));
            console.log(c.green(`\nYou are now on ${c.green.bold.underline(`v${latest}`)}! To verify, run ${c.cyan.bold('mdb version')}.`));
            console.log(c.green(`Check out what's changed by running ${c.cyan.bold('mdb changelog')}.\n`));
          } catch (error) {
            consola.error(new Error(c.red(`Update failed: ${error.message}`)));
            spinner.stop();
          }
        } else {
          console.log(c.green.bold('\nUpdate canceled.\n'));
        }
      } else {
        console.log(c.green(`\nYou are already on the latest version, ${c.magenta(packageInfo.version)}.\n`));
      }
    } catch (error) {
      console.log()
      consola.error(new Error(c.red(`An error occurred while checking for updates: ${error.message}`)));
    } finally {
      spinner.stop();
    }
  });

// Search Command
  program
  .command('search')
  .alias('s')
  .alias('find')
  .description('display badges available in a category')
  .action(async () => {
    let continueSearch = true;

    while (continueSearch) {
      const categories = Object.keys(badges);

      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'category',
          message: gradient.fruit('Select a category:'),
          choices: categories.map(formatCategoryName),
        },
      ]);

      const formattedCategory = searchCategory(answers.category);
      const categoryData = badges[formattedCategory];

      if (categoryData) {
        console.log(c.green(`\nBadges available in ${c.green.underline(answers.category)}:\n`));
        Object.keys(categoryData).forEach((badge) => {
          console.log(c.green(`• ${badge}`));
        });
        console.log(c.cyan(`\nTo get the ${c.underline('Markdown')} version of a badge, type ${c.magenta(`mdb ${formattedCategory} <badgeName>`)}.\n`));
      } else {
        consola.error(c.red(`The specified category could not be found.`));
      }

      // by default, this is selected as Yes
      const { searchAgain } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'searchAgain',
          message: gradient.fruit('Would you like to search another category?'),
          default: true,
        },
      ]);

      continueSearch = searchAgain; // loop
    }
  });

// Badge Creator Command
  program
  .command("create")
  .alias("generate")
  .description("display prompts to create your own badge")
  .action(async () => {
    try {
      const response = await inquirer.prompt([
        {
          type: "text",
          name: "alt",
          message: gradient.fruit("Enter the Alt Text for the badge (e.g. ![Alt Text]):"),
          validate: (value) => {
            if (!value.trim()) {
              return c.red("This field is required.");
            }
            return true;
          },
        },
        {
          type: "text",
          name: "name",
          message: gradient.fruit("Enter the text you'd like to display on the badge:"),
          validate: (value) => {
            if (!value.trim()) {
              return c.red("This field is required.");
            }
            return true;
          },
        },
        {
          type: "text",
          name: "color",
          message: gradient.fruit("Enter a hexadecimal value for the badge:"),
          validate: (value) => {
            const hexColorRegex = /^#?(?:[0-9a-fA-F]{3}){1,2}$/;
            if (!hexColorRegex.test(value.trim())) {
              return c.red("Please enter a valid hexadecimal color. (e.g., #000000, #FDE13B)");
            }
            return true;
          },
        },
        {
          type: "text",
          name: "logo",
          message: gradient.fruit("Enter the logo for the badge:"),
          validate: (value) => {
            if (!value.trim()) {
              return c.red("This field is required.");
            }
            return true;
          },
        },
        {
          type: "list",
          name: "style",
          message: gradient.fruit("Choose the style of the badge:"),
          choices: [
            "flat",
            "flat-square",
            "plastic",
            "social",
            "for-the-badge",
          ],
        },
        {
          type: "text",
          name: "logoColor",
          message:gradient.fruit("Enter the logo color for the badge:"),
          initial: "",
        },
        {
          type: "text",
          name: "link",
          message:gradient.fruit(`(Optional) Enter the URL to redirect to:`),
          initial: "",
        },
      ]);

      const { alt, name, color, logo, style, logoColor, link } = response;

      let badgeLink = `https://img.shields.io/badge/${encodeURIComponent(name)}-${encodeURIComponent(color)}?logo=${encodeURIComponent(logo)}&style=${encodeURIComponent(style)}`;

      if (logoColor) {
        badgeLink += `&logoColor=${encodeURIComponent(logoColor)}`;
      }

      const badgeMarkdown = link
        ? `[![${alt}](${badgeLink})](${link})`
        : `[![${alt}](${badgeLink})](#)`;

      const badgeHtml = `<a href="${escapeHtml(link)}">\n  <img src="${badgeLink}" alt="${escapeHtml(alt)}" />\n</a>`;

      console.log(c.green.bold("\n✅ Custom badge created successfully!\n"));
      console.log(c.green.bold("Markdown:"));
      console.log(chalk.hex("#FFBF00").bold(`${badgeMarkdown}\n`)); // Markdown
      console.log(c.green.bold("HTML:"));
      console.log(chalk.hex("#FFBF00").bold(`${badgeHtml}\n`)); // HTML
    } catch (error) {
      consola.error(new Error(c.red(`An error occurred when trying to make your badge: ${error.message}`)));
    }
  });

// About/Info Command
program
  .command('about')
  .alias('abt')
  .description('display general information about the package')
  .action(async () => {
    async function displayAboutInfo() {
      try {
        const response = await axios.get(`https://registry.npmjs.org/${packageInfo.name}`);
        const latestVersion = response.data["dist-tags"].latest;

        // counts the number of badges and saves it in numOfBadges
        let numOfBadges = 0;
        Object.values(badges).forEach(category => {
          numOfBadges += Object.keys(category).length;
        });

        console.log(c.green.bold('\n                    _  _                 _                                 _  _ '));
        console.log(c.green.bold('                    | || |               | |                               | |(_) '));
        console.log(c.green.bold('      _ __ ___    __| || |__    __ _   __| |  __ _   ___  ___  ______  ___ | | _ '));
        console.log(c.green.bold('     | \'_ ` _ \\  / _` || \'_ \\  / _` | / _` | / _` | / _ \\/ __||______|/ __|| || |'));
        console.log(c.green.bold('     | | | | | || (_| || |_) || (_| || (_| || (_| ||  __/\\__ \\       | (__ | || |'));
        console.log(c.green.bold('     |_| |_| |_| \\__,_||_.__/  \\__,_| \\__,_| \\__, | \\___||___/        \\___||_||_|'));
        console.log(c.green.bold('                                              __/ |                              '));
        console.log(c.green.bold('                                             |___/                               \n'));
        console.log(c.blue.bold('An extensive CLI tool to find Shields.io badges without needing to leaving the terminal.'));    
        console.log(c.blue.bold('                               https://mdbcli.xyz                            \n'));
        console.log(c.yellow(`${c.yellow.bold.underline('Latest:')} ${latestVersion}`));

        const userPackageVersion = packageInfo.version;
        console.log(c.yellow(`${c.yellow.bold.underline('Your Version:')} ${userPackageVersion}`));
        console.log(c.blue(`If these versions do not match, run ${c.cyan.bold('mdb update')}.\n`));

        console.log(c.yellow(`Badges Available: ${c.yellow.bold(numOfBadges)}\n`));

        console.log(c.blue(`• ${c.cyan.bold('mdb help')} to view the available list of commands`));
        console.log(c.blue(`• ${c.cyan.bold('mdb changelog')} to view the latest release`));
        console.log(c.blue(`• ${c.cyan.bold('mdb docs')} to view the documentation`))
        console.log(c.blue(`• ${c.cyan.bold('mdb fund')} for various donation methods\n`));

        console.log(c.blue(`• Issues: ${c.blue.bold.underline(`https://github.com/inttter/${packageInfo.name}/issues`)}`));
        console.log(c.blue(`• Contribute: ${c.blue.bold.underline('https://tinyurl.com/mdbcontributing')}`));
        console.log(c.blue(`• License: ${c.blue.underline.bold('https://tinyurl.com/mdblicense')}`));
      } catch (error) {
        consola.error(new Error(c.red(`An error occurred when fetching the latest version: ${error.message}`)));
      }
    }

    // Call the function
    await displayAboutInfo();
  });

/// Random Badge Command
program
  .command('random')
  .alias('r')
  .description('display a random badge')
  .action(async () => {
    const categories = Object.keys(badges);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const badgesInCategory = Object.keys(badges[randomCategory]);
    const randomBadgeName = badgesInCategory[Math.floor(Math.random() * badgesInCategory.length)];
    const badge = badges[randomCategory][randomBadgeName];

    const badgeLink = badge.match(/\(([^)]+)\)/)[1];
    const badgeAlt = badge.match(/\[([^)]+)\]/)[1];

    const markdownBadge = `[${badgeAlt}](${badgeLink})`;
    const htmlBadgeAlt = badgeAlt.replace(/^!\[/, ''); // Strip the '!' from the alt text
    const htmlBadge = `<img src="${badgeLink}" alt="${htmlBadgeAlt}" />`;

    // outputs both versions, Markdown and HTML
    console.log(c.green.underline.bold('\nMarkdown:'));
    console.log(chalk.hex("#FFBF00").bold(`${markdownBadge}\n`));

    console.log(c.green.underline.bold('HTML:'));
    console.log(chalk.hex("#FFBF00").bold(htmlBadge));
  });

// Copy Command
program
  .command("copy [category] [badgeName]")
  .alias("c")
  .description("copy a badge's code to the clipboard")
  .action((category, badgeName) => {
    const formattedCategory = category.toLowerCase();
    const formattedBadgeName = badgeName.toLowerCase();

    if (
      badges[formattedCategory] &&
      badges[formattedCategory][formattedBadgeName]
    ) {
      const selectedBadge = badges[formattedCategory][formattedBadgeName];
      clipboardy.writeSync(selectedBadge);
      console.log(c.green.bold(`\nCopied to the clipboard successfully.\n`));
    } else {
      consola.error(c.red(`The specified category could not be found.`));
      console.log(c.cyan(`Try running ${c.magenta.bold(`mdb search`)} for a list of categories.\n`));
    }
  });

// Lookup Command
  program
  .command("lookup [keyword]")
  .alias("l")
  .description("display badges containing a certain keyword")
  .action(async (query) => {
    let badgeChoices = [];
    Object.keys(badges).forEach((category) => {
      const categoryData = badges[category];
      Object.keys(categoryData).forEach((badgeName) => {
        if (badgeName.toLowerCase().includes(query.toLowerCase())) {
          const formattedCategory = formatCategoryName(category);
          const formattedBadge = formatBadgeName(badgeName);
          badgeChoices.push({
            name: `${c.green(formattedBadge)} in ${c.yellow(formattedCategory)}`,
            value: categoryData[badgeName], // stores the badge code as the value
          });
        }
      });
    });

    if (!badgeChoices.length) {
      consola.error(c.red('A badge containing that keyword could not be found.'));
    } else {
      const { selectedBadge } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedBadge',
          message: gradient.fruit('Select a badge:'),
          choices: badgeChoices,
        },
      ]);

      console.log(c.green.bold('\nBadge found:'));
      console.log(chalk.hex("#FFBF00")(selectedBadge));
    }
  });

// Adding Badge To File Command
  program
  .command("add [category] [badgeName] [filePath]")
  .description("add a badge to a Markdown file")
  .action((category, badgeName, filePath = "README.md") => {
    const formattedCategory = formatCategoryName(category);
    const formattedBadgeName = badgeName.toLowerCase();
    const categoryData = badges[category.toLowerCase()];

    if (!categoryData) {
      consola.error(c.red(`The category you specified could not be found.`));
      console.log(c.cyan(`You can try visiting the syntax list for the categories here: ${c.magenta.bold('https://tinyurl.com/mdbcategories')}\n`));
      return;
    }

    const foundBadge = Object.keys(categoryData).find(
      (key) => key.toLowerCase() === formattedBadgeName,
    );

    if (!foundBadge) {
      consola.error(c.red(`The badge you specified could not be found.`));
      console.log(c.cyan(`Try running ${c.magenta.bold(`mdb search`)} for a full list of badges in this category.\n`));
      return;
    }

    const badge = categoryData[foundBadge];

    // checks if the badge is defined and checks if the regex match is successful
    const badgeLinkMatch = badge.match(/\(([^)]+)\)/);
    if (!badgeLinkMatch || !badgeLinkMatch[1]) {
      consola.error(new Error(c.red("The badge link could not be found in the expected format.")));
      return;
    }

    // extracts the badge link and its name
    const badgeLink = badgeLinkMatch[1];
    const badgeAlt = badge.match(/\[([^)]+)\]/)[1];

    const badgeMarkdown = `[${badgeAlt}](${badgeLink})](#)`;

    try {
      fileContent = fs.readFileSync(filePath, "utf8");
    } catch (error) {
      consola.error(new Error(c.red(`Could not read the file: ${error.message}`)));
      return;
    }

    // appends the badge to the specified file (path)
    try {
      fs.appendFileSync(filePath, `\n${badgeMarkdown}`, "utf8");
      consola.success(c.green(`Badge has been added to the file successfully.`));
    } catch (error) {
      consola.error(new Error(c.red(`Could not write to the file: ${error.message}`)));
    }
  });

// Documentation Command
  program
  .command('documentation')
  .alias('docs')
  .description('open a link to the documentation in your browser')
  .action(async () => {
    console.log();
    const spinner = ora({
      text: c.blue("Opening the documentation in your browser..."),
      spinner: cliSpinners.arc,
      color: "yellow",
    }).start();

    const docsLink = 'https://docs.mdbcli.xyz/'

    try {
      await open(docsLink);
      spinner.succeed(c.green("Opened in your browser!"));
    } catch (error) {
      consola.error(new Error(c.red(`An error occurred when trying to open the link in your browser: ${error.message}`)));
      console.log(c.cyan(`\n  You can visit the page by clicking on the following link instead: ${c.magenta.bold(docsLink)}`))
      spinner.stop()
    }
  });

// Help Command
  program
  .command('help')
  .description('display help information')
  .action(() => {
    program.outputHelp();
  });

// Changelog/Releases Command
program
  .command('changelog')
  .alias('release')
  .description('open a link to the latest release and it\'s changelog in your browser')
  .action(async () => {
    console.log()
    const spinner = ora({
      text: c.blue("Opening the latest release..."),
      spinner: cliSpinners.arc,
      color: "magenta",
    }).start();

    const changelogLink = `https://github.com/inttter/${packageInfo.name}/releases/latest`

    try {
      await open(changelogLink);

      spinner.succeed(c.green("Opened in your browser!"));
    } catch (error) {
      consola.error(new Error(c.red(`Could not open the link in your browser: ${error.message}`)));
      console.log(c.cyan(`\n  You can visit the page by clicking on the following link instead: ${c.magenta.bold(changelogLink)}`))
      spinner.stop()
    }
  });

program.parse(process.argv);