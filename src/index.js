#!/usr/bin/env node

const { program } = require("commander");
const axios = require("axios");
const chalk = require("chalk");
const prompts = require("prompts");
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
  .arguments("<category> [badgeNames...]")
  .usage("<category> [badgeNames] [--options]")
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
            const linkResponse = await prompts({
              type: "text",
              name: "link",
              message: badgeNames.length === 1 ? c.blue("Enter your link here:") : index === 0 ? c.blue("Enter your first link here, then click Enter and type the rest below:") : "",
              validate: (value) => {
                return value.trim() === '' ? c.red("Please enter a link.") : true; 
              },
            });
            link = linkResponse.link;
            links.push(link);
          }
        } else {
          consola.error(c.red(`${(formatBadgeName(badgeName))} is not a valid badge.`));
          console.log(c.cyan(`Try running ${c.blue('mdb search')} for a list of badges in that category.`));
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
          if (options.html) {
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
      
              const htmlBadge = `<a href="${escapeHtml(links[index])}"><img alt="${escapeHtml(badgeAlt)}" src="${badgeLink}${styleOption}"></a>`;
              console.log(chalk.hex("#FFBF00")(htmlBadge));
            } else {
              consola.error(c.red("Could not extract badge link or alt text."));
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

            const badgeMarkdown = links[index]
              ? `[${escapeHtml(badgeAlt)}](${badgeLink}${styleOption})](${links[index]})`
              : `[${escapeHtml(badgeAlt)}](${badgeLink}${styleOption})](#)`;

            console.log(chalk.hex("#FFBF00").bold(badgeMarkdown));
          }
        }
      }

      console.log();
    } else {
      consola.error(c.red(`That category could not be found.`));
      console.log(c.cyan(`You can try visiting the syntax list for the categories here: ${c.blue.bold('http://tinyurl.com/mdbcategories')}`));
    }
  });

// Fund Command
program
  .command("fund")
  .description("display funding/donation links for the package")
  .action(() => {
    console.log();
    console.log(c.yellow("If you would like, you can donate to me here:"));
    console.log();
    console.log(c.green(`Buy Me A Coffee: ${c.green.bold.underline('https://www.buymeacoffee.com/intter')}`));
    console.log(c.green(`GitHub Sponsors: ${c.green.bold.underline('https://github.com/sponsors/inttter')}`));
    console.log(c.green(`Ko-fi: ${c.green.bold.underline('https://ko-fi.com/intter')}`));
    console.log();
  });

// Version Checking Command
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
    console.log();
    const spinner = ora({
      text: c.blue("Opening in browser..."),
      spinner: cliSpinners.earth,
      color: "magenta",
    }).start();

    try {
      await open("https://github.com/inttter/md-badges?tab=readme-ov-file#-table-of-contents");

      // stops when the page is loaded in browser
      spinner.succeed(c.green("Opened in your browser!"));
    } catch (error) {
      consola.error(c.red(`An error occurred when trying to open the link in your browser: ${error.message}`));
      spinner.stop()
    } finally {
      setTimeout(() => {
        console.log();
        console.log(c.yellow('Hasn\'t opened yet? Try one of these two links:'));
        console.log(c.magenta(`https://github.com/inttter/md-badges`));
        console.log(c.magenta(`https://mdbdocs.inttter.com/content/badges`));
      }, 2000); // 5 seconds
    }
  });

  program
  .command('update [--check]')
  .alias('upd')
  .alias('u')
  .description('automatically update the package')
  .option('--check', 'check for updates')
  .action(async (check, options) => {
    const spinner = ora({
      text: chalk.blue('Checking for updates...'),
      spinner: cliSpinners.earth,
      color: 'magenta',
    }).start();

    try {
      const response = await axios.get('https://registry.npmjs.org/mdbadges-cli');
      const latest = response.data['dist-tags'].latest;

      spinner.stop();

      if (options.check && latest < packageInfo.version) {
        console.log();
        const updateMessage = boxen(
          `An update is available: ${c.dim(packageInfo.version)} ➜  ${c.green(latest)}\nRun ${c.cyan('mdb update')} to update`, 
          { padding: 1, margin: 1, borderStyle: 'double', title: '🔵 Important', titleAlignment: 'center', borderColor: '#289FF9' }
        );
        console.log(updateMessage);
      } else if (options.check && latest >= packageInfo.version) {
        console.log();
        console.log(c.green.bold(`You are already on the latest version, ${c.cyan(packageInfo.version)}.`));
        console.log();
      } else if (!options.check && latest < packageInfo.version) {
        console.log();
        const updateSpinner = ora({ text: chalk.cyan('Updating...\n\n'), spinner: cliSpinners.arc }).start();

        try {
          await execa.command('npm install -g mdbadges-cli@latest', { stdio: 'inherit' });

          updateSpinner.succeed(chalk.green('Update complete!'));
          console.log();
          console.log(c.green(`Check out what's changed by running ${c.cyan('mdb changelog')}.`));
          console.log();
        } catch (error) {
          updateSpinner.fail(chalk.red(`Update failed: ${error.message}`));
        }
      } else if (!options.check && latest >= packageInfo.version) {
        console.log();
        console.log(c.green.bold('You are already on the latest version.'));
        console.log();
      }
    } catch (error) {
      console.log();
      consola.error(c.red(`An error occurred while checking for updates: ${error.message}`));
      console.log();
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
        console.log();
        console.log(c.green(`Badges available in ${(answers.category)}:`));
        console.log();
        Object.keys(categoryData).forEach((badge) => {
          console.log(c.green(`• ${badge}`));
        });
        console.log(
          c.cyan(`\nTo get the ${c.underline('Markdown')} version of a badge, type 'mdb ${formattedCategory} <badgeName>'.`));
        console.log(
          c.cyan(`To get the ${c.underline('HTML')} version of a badge, type 'mdb --html ${formattedCategory} <badgeName>'.`));
        console.log();
      } else {
        consola.error(c.red(`The specified category could not be found.`));
        console.log();
      }

      const { searchAgain } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'searchAgain',
          message: gradient.fruit('Do you want to search another category?'),
          default: true, // if nothing is selected, true (aka y/yes) is automatically selected
        },
      ]);

      continueSearch = searchAgain; // if "y", it loops the command
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

      const badgeHtml = `<a href="${escapeHtml(link)}"><img alt="${escapeHtml(alt)}" src="${badgeLink}" /></a>`;

      console.log();
      console.log(c.green.bold("Custom badge created:"));
      console.log();
      console.log(c.yellow.underline.bold("Markdown:"));
      console.log(c.green(badgeMarkdown)); // displays the code with users' inputs
      console.log();
      console.log(c.yellow.underline.bold("HTML:"));
      console.log(c.green(badgeHtml)); // displays the HTML version
      console.log();
    } catch (error) {
      consola.error(c.red(`An error occurred when trying to make your badge: ${error.message}`));
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
        const response = await axios.get(`https://registry.npmjs.org/mdbadges-cli`);
        const latestVersion = response.data["dist-tags"].latest;

        // counts the number of badges and saves it in numOfBadges
        let numOfBadges = 0;
        Object.values(badges).forEach(category => {
          numOfBadges += Object.keys(category).length;
        });

        console.log();
        console.log(c.green.bold('                    _  _                 _                                 _  _ '));
        console.log(c.green.bold('                    | || |               | |                               | |(_) '));
        console.log(c.green.bold('      _ __ ___    __| || |__    __ _   __| |  __ _   ___  ___  ______  ___ | | _ '));
        console.log(c.green.bold('     | \'_ ` _ \\  / _` || \'_ \\  / _` | / _` | / _` | / _ \\/ __||______|/ __|| || |'));
        console.log(c.green.bold('     | | | | | || (_| || |_) || (_| || (_| || (_| ||  __/\\__ \\       | (__ | || |'));
        console.log(c.green.bold('     |_| |_| |_| \\__,_||_.__/  \\__,_| \\__,_| \\__, | \\___||___/        \\___||_||_|'));
        console.log(c.green.bold('                                              __/ |                              '));
        console.log(c.green.bold('                                             |___/                               '));
        console.log();
        console.log(c.blue.bold('An extensive CLI tool to find Shields.io badges without needing to leaving the terminal.'));    
        console.log(c.blue.bold('                               https://mdbcli.xyz                            '));
        console.log();
        console.log(c.yellow(`${c.yellow.bold.underline('Latest:')} ${latestVersion}`));

        const userPackageVersion = packageInfo.version;
        console.log(c.yellow(`${c.yellow.bold.underline('Your Version:')} ${userPackageVersion}`));
        console.log(c.blue(`If these versions do not match, run ${c.cyan.bold('mdb update')}.`));
        console.log();
        console.log(c.yellow(`Badges Available: ${numOfBadges}`));
        consola.log();
        console.log(c.blue(`• ${c.cyan.bold('mdb help')} to view the available list of commands`));
        console.log(c.blue(`• ${c.cyan.bold('mdb changelog')} to view the latest release`));
        console.log(c.blue(`• ${c.cyan.bold('mdb docs')} to view the documentation`))
        console.log(c.blue(`• ${c.cyan.bold('mdb fund')} for various donation methods`));
        console.log();
        console.log(c.blue(`• Issues: ${c.blue.bold.underline('https://github.com/inttter/mdbadges-cli/issues')}`));
        console.log(c.blue(`• Contribute: ${c.blue.bold.underline('http://tinyurl.com/mdbcontributing')}`));
        console.log(c.blue(`• License: ${c.blue.underline.bold('http://tinyurl.com/mdblicense')}`));
      } catch (error) {
        consola.error(c.red(`An error occurred when fetching the latest version: ${error.message}`));
      }
    }

    // Call the function
    await displayAboutInfo();
  });

// Random Badge Command
  program
  .command('random')
  .alias('r')
  .description('display a random badge')
  .option('-c, --category', 'pick random badge from a specific category')
  .action(async (options) => {
    // the logic below is for --category/-c
    if (options.category) {
      const categoryPrompt = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedCategory',
          message: gradient.fruit('Choose a category:'),
          choices: Object.keys(badges),
          // turns out formatCategoryName seems to break it here, so its not being used
        },
      ]);

      const selectedCategory = categoryPrompt.selectedCategory.toLowerCase();

      if (!badges[selectedCategory]) {
        console.log(c.red(`No badges found in the selected category: ${selectedCategory}`));
        return;
      }

      const stylePrompt = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedStyle',
          message: gradient.fruit('Choose a style:'),
          choices: ['flat', 'flat-square', 'plastic', 'social', 'for-the-badge'],
        },
      ]);

      const selectedStyle = stylePrompt.selectedStyle;

      const badgesInCategory = Object.keys(badges[selectedCategory]);
      const randomBadgeName =
        badgesInCategory[Math.floor(Math.random() * badgesInCategory.length)];
      const badge = badges[selectedCategory][randomBadgeName];

      const badgeLink = badge.match(/\(([^)]+)\)/)[1];
      const badgeAlt = badge.match(/\[([^)]+)\]/)[1];

      let styleParam = '';
      if (selectedStyle) {
        styleParam = `&style=${selectedStyle}`;
      }

      const markdownBadge = `[${badgeAlt}](${badgeLink}${styleParam})`;
      const htmlBadge = `<img src="${badgeLink}${styleParam}" />`;

      // this outputs BOTH versions, Markdown and HTML
      console.log();
      console.log(c.yellow.underline.bold('Markdown:')); 
      console.log(c.green(markdownBadge));
      console.log();
      console.log(c.yellow.underline.bold('HTML:'));
      console.log(c.green(htmlBadge));
      // -----------------------------------------------------------------------
      // the logic below is for the command without --category/-c (aka just mdb random)
    } else {
      const categories = Object.keys(badges);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const badgesInCategory = Object.keys(badges[randomCategory]);
      const randomBadgeName =
        badgesInCategory[Math.floor(Math.random() * badgesInCategory.length)];
      const badge = badges[randomCategory][randomBadgeName];

      const badgeLink = badge.match(/\(([^)]+)\)/)[1];
      const badgeAlt = badge.match(/\[([^)]+)\]/)[1];

      const markdownBadge = `[${badgeAlt}](${badgeLink})`;
      const htmlBadge = `<img src="${badgeLink}" />`;

      // Output both versions, Markdown and HTML.
      console.log();
      console.log(c.yellow.underline.bold('Markdown:')); 
      console.log(c.green(markdownBadge));
      console.log();
      console.log(c.yellow.underline.bold('HTML:'));
      console.log(c.green(htmlBadge));
    }
  });

// Copy Command
program
  .command("copy <category> <badgeName>")
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
      console.log();
      console.log(
        c.green.bold(`Copied to the clipboard successfully.`),
      );
    } else {
      consola.error(c.red(`The specified could not be found.`));
      console.log(c.blue(`Try running ${c.cyan(`mdb search`)} and then selecting ${c.cyan(category)} for a full list of badges in this category.`));
      console.log();
    }
  });

// Lookup Command
  program
  .command("lookup <keyword>")
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
      consola.error(c.red(`A badge containing that keyword could not be found.`));
    } else {
      const { selectedBadge } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedBadge',
          message: gradient.fruit('Select a badge:'),
          choices: badgeChoices,
        },
      ]);

      console.log();
      console.log(c.green.bold('Badge found:'));
      console.log(chalk.hex("#FFBF00")(selectedBadge));
    }
  });

// Adding Badge To File Command
  program
  .command("add <category> <badgeName> [filePath]")
  .description("add a badge to a Markdown file")
  .action((category, badgeName, filePath = "README.md") => {
    const formattedCategory = formatCategoryName(category);
    const categoryData = badges[category.toLowerCase()];

    if (!categoryData) {
      consola.error(c.red(`The category you specified could not be found.`));
      console.log(c.cyan(`You can try visiting the syntax list for the categories here: ${c.blue.bold('http://tinyurl.com/mdbcategories')}`));
      console.log();
      return;
    }

    const formattedBadgeName = badgeName.toLowerCase();
    const foundBadge = Object.keys(categoryData).find(
      (key) => key.toLowerCase() === formattedBadgeName,
    );

    if (!foundBadge) {
      console.log();
      consola.error(c.red(`The badge you specified could not be found.`));
      console.log(c.cyan(`Try running ${c.blue.bold(`mdb search`)} for a full list of badges in this category.`,));
      console.log();
      return;
    }

    const badge = categoryData[foundBadge];

    // this checks if the badge is defined + if the regex match is successful
    const badgeLinkMatch = badge.match(/\(([^)]+)\)/);
    if (!badgeLinkMatch || !badgeLinkMatch[1]) {
      consola.error(c.red("The badge link could not be found in the expected format."));
      return;
    }

    // extracts the badge link and its name
    const badgeLink = badgeLinkMatch[1];
    const badgeAlt = badge.match(/\[([^)]+)\]/)[1];

    const badgeMarkdown = `[${badgeAlt}](${badgeLink})](#)`;

    // Check if the specified file has the ".md" extension
    if (!filePath.toLowerCase().endsWith(".md")) {
      console.log();
      consola.error(c.red(`Could not add badge to your file. Try checking that your file type and file name is valid. If you're working with subdirectories, make sure the path you specified exists.`));
    return;
  }

    // reads the existing content of the file
    const fs = require("fs");
    let fileContent = "";
    try {
      fileContent = fs.readFileSync(filePath, "utf8");
    } catch (error) {
      consola.error(c.red(`Could not read the file: ${error.message}`));
      return;
    }

    // adds the badge to the file
    try {
      fs.appendFileSync(filePath, `\n${badgeMarkdown}\n`, "utf8");
      console.log()
      console.log(c.green("Badge added to the file successfully."));
    } catch (error) {
      consola.error(c.red(`Could not write to the file: ${error.message}`));
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
      spinner: cliSpinners.earth,
      color: "yellow",
  }).start();

  try {
    await open("https://docs.mdbcli.xyz/");

    spinner.succeed(c.green("Opened in your browser!"));
  } catch (error) {
    consola.error(c.red(`An error occurred when trying to open the link in your browser: ${error.message}`));
    spinner.stop()
  } finally {
    setTimeout(() => {
      console.log();
      console.log(c.yellow('Hasn\'t opened in your browser? Try clicking on the link below:'));
      console.log(c.magenta(`https://docs.mdbcli.xyz/`));
    }, 2000) // 5 seconds
  }
});

// Help Command
// Do note this literally just runs what mdb --help would show.
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
  .description('open a link to the latest release with it\'s changelog in your browser')
  .action(async () => {
    console.log()
    const spinner = ora({
      text: c.blue("Opening the latest release..."),
      spinner: cliSpinners.earth,
      color: "magenta",
    }).start();

    try {
      await open('https://github.com/inttter/mdbadges-cli/releases/latest');

      spinner.succeed(c.green("Opened in your browser!"));
    } catch (error) {
      consola.error(c.red(`Could not open the link in your browser: ${error.message}`));
      spinner.stop()
    } finally {
      setTimeout(() => {
        console.log();
        console.log(c.yellow('Hasn\'t opened in your browser? Try clicking on the link below:'));
        console.log(c.magenta(`https://github.com/inttter/mdbadges-cli/releases/latest`));
      }, 2000) // 5 seconds
    }
  });

program.parse(process.argv);