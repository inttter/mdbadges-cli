#!/usr/bin/env node

const { program } = require("commander");
const { spawn } = require('child_process');
const path = require('path');
const axios = require("axios");
const chalk = require("chalk");
const prompts = require("prompts");
const clipboardy = require("clipboardy");
const ora = require("ora");
const gradient = require("gradient-string");
const fs = require("fs");
const inquirer = require("inquirer");
const open = require("open");
const boxen = require("boxen");
const badges = require("./badges");
const utils = require("./utils");
const packageInfo = require("../package.json");

const {
  formatCategoryName,
  searchCategory,
  formatBadgeName,
  escapeHtml,
} = utils;

program.version("4.3.1").description("Find badges without ever leaving the terminal.");

program
  .arguments("<category> [badgeNames...]") // [badgeNames...] allows for more than one badge
  .description("Displays Markdown for specified badge in a category.")
  .option("--html", "Toggles HTML version of a badge") // tag that toggles html code
  .option("-s, --style <badgeStyle>", "Toggles style of a badge") // tags that toggle badge style
  .option("--link", "Toggles links in a badge") // tag that toggles links in the badge
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
              message: badgeNames.length === 1 ? gradient.vice("Enter your link here:") : index === 0 ? gradient.vice("Enter your first link here, then click Enter and type the rest below:") : "",
              validate: (value) => {
                return value.trim() === '' ? "Please enter a link." : true; // shows if no link is entered
              },
            });
            link = linkResponse.link;
            links.push(link);
          }
        } else {
          console.log(
            chalk.hex("#FF0000")(
              `Badge "${(formatBadgeName(badgeName))}" not found.`,
            ),
          );
          console.log(
            chalk.hex("#289FF9")(
              `If your name has a space, try entering a dash.`,
            ),
          );
          console.log(chalk.hex("#289FF9")(`e.g., applemusic -> apple-music`));
        }
      }

      if (badgesFound) {
        console.log(gradient.cristal(`Badge found:`));
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
              console.log(chalk.hex("#FFBF00").bold(htmlBadge));
            } else {
              console.log(
                chalk.hex("#FF0000")("Error extracting badge link or alt text."),
              );
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
                console.log(
                  chalk.hex("#FF0000")(
                    "Invalid style. Using default (flat)...",
                  ),
                );
              }
            }
            const styleOption = options.style ? `&style=${options.style}` : ""; // Adds style option if one is provided
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
      console.log()
      console.log(chalk.hex("#FF0000")(`That category could not be found.`));
      console.log()
    }
  });

program
  .command("fund")
  .description("Displays funding/donation links for the package.")
  .action(() => {
    console.log();
    console.log(
      gradient.cristal("If you would like, you can donate to me here:"),
    );
    console.log();
    console.log(
      gradient.fruit("Buy Me A Coffee: https://www.buymeacoffee.com/intter"),
    );
    console.log(
      gradient.fruit("GitHub Sponsors: https://github.com/sponsors/inttter"),
    );
    console.log(
      gradient.fruit("Ko-fi: https://ko-fi.com/intter")
    );
    console.log();
  });

program
  .command("version")
  .alias("ver")
  .alias("v")
  .description("Displays the current version you are on.")
  .action(() => {
    console.log();
    console.log(gradient.cristal(`${packageInfo.version}`)); // fetches package info version from package.json
    console.log();
  });

  program
  .command("badges")
  .alias("list")
  .description("Opens a link to the badge list in your browser.")
  .action(async () => {
    console.log();
    const spinner = ora({
      text: chalk.hex("#289FF9")("Opening in browser..."),
      color: "yellow",
    }).start();

    try {
      await open("https://github.com/inttter/md-badges?tab=readme-ov-file#-table-of-contents");

      // stops when the page is loaded in browser
      spinner.succeed(chalk.hex("#10F66C")("Opened in your browser!"));
    } catch (error) {
      spinner.fail("An error occurred opening the link in your browser.");

      console.error(chalk.red(`${error.message}`));
    } finally {
      setTimeout(() => {
        console.log();
        console.log(gradient.cristal('Hasn\'t opened yet? Try one of these two links:'));
        console.log(chalk.hex("#10F66C").bold(`https://github.com/inttter/md-badges`));
        console.log(chalk.hex("#10F66C").bold(`https://docs.inttter.com/content/badges`));
      }, 5000); // 5 seconds
    }
  });

  program
  .command("update")
  .alias("upd")
  .alias("u")
  .description("Checks for updates to the package.")
  .action(async () => {
    const spinner = ora({
      text: "Checking for updates...",
      color: "yellow",
    }).start();
    
    try {
      const response = await axios.get("https://registry.npmjs.org/mdbadges-cli");
      const latest = response.data["dist-tags"].latest;

      if (latest > packageInfo.version) {
        console.log();
        const updateMessage = boxen( // shows if update is available
          `An update is available: ${chalk.dim(packageInfo.version)} ➜  ${chalk.hex('#BAE7BC')(latest)}\n` +
          `Run ${gradient.cristal("npm install -g mdbadges-cli@latest")} to update.`,
          { padding: 1, margin: 1, borderStyle: 'double', title: '🔵 Important', titleAlignment: 'center', borderColor: '#289FF9' }
        );
        console.log(updateMessage); // shows the text from 3-4 lines above
        console.log();
      } else {
        console.log();
        const updateMessageSuccess = boxen( // shows if already on latest version
          chalk.hex("#10F66C").bold(`You are already on the latest version.`),
          { padding: 1, margin: 1, borderStyle: 'double', title: '✅ Success', titleAlignment: 'center', borderColor: '#10F66C' }
        );
        console.log(updateMessageSuccess); // shows the text from 3 lines above
      }
    } catch (error) {
      console.log();
      console.error(
        chalk.hex("#FF0000")("An error occurred while checking for updates:"),
      );
      console.error(chalk.hex("#FF0000")(error.message));
      console.log();
    } finally {
      spinner.stop();
    }
  });

  program
  .command('search')
  .alias('s')
  .alias('find')
  .description('Displays badges available in a category.')
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
        console.log(gradient.cristal(`Badges available in ${(answers.category)}:`));
        console.log();
        Object.keys(categoryData).forEach((badge) => {
          console.log(gradient.cristal(`• ${badge}`));
        });
        console.log(
          chalk.hex('#289FF9')(
            `\nTo get the ${gradient.cristal('Markdown')} version of a badge, type 'mdb ${formattedCategory} <badgeName>'.`,
          ),
        );
        console.log(
          chalk.hex('#289FF9')(
            `To get the ${gradient.cristal('HTML')} version of a badge, type 'mdb --html ${formattedCategory} <badgeName>'.`,
          ),
        );
        console.log();
      } else {
        console.log(
          chalk.hex('#FF0000')(`Category "${answers.category}" could not be found.`),
        );
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

  program
  .command("create")
  .alias("generate")
  .description("Displays prompts to create your own badge.")
  .action(async () => {
    try {
      const response = await inquirer.prompt([
        {
          type: "text",
          name: "alt",
          message: gradient.fruit(
            "Enter the Alt Text for the badge (e.g. ![Alt Text]):",
          ),
          validate: (value) => {
            if (!value.trim()) {
              return "This field is required.";
            }
            return true;
          },
        },
        {
          type: "text",
          name: "name",
          message: gradient.fruit(
            "Enter the text you'd like to display on the badge:",
          ),
          validate: (value) => {
            if (!value.trim()) {
              return "This field is required.";
            }
            return true;
          },
        },
        {
          type: "text",
          name: "color",
          message: gradient.fruit(
            "Enter a hexadecimal value for the badge:",
          ),
          validate: (value) => {
            const hexColorRegex = /^#?(?:[0-9a-fA-F]{3}){1,2}$/;
            if (!hexColorRegex.test(value.trim())) {
              return "Please enter a valid hexadecimal color. (e.g., #000000, #FDE13B)";
            }
            return true;
          },
        },
        {
          type: "text",
          name: "logo",
          message: gradient.fruit(
            "Enter the logo for the badge:"
          ),
          validate: (value) => {
            if (!value.trim()) {
              return "This field is required.";
            }
            return true;
          },
        },
        {
          type: "list",
          name: "style",
          message: gradient.fruit(
            "Choose the style of the badge:"
          ),
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
          message:
            gradient.fruit(
              "Enter the logo color for the badge:"
            ),
          initial: "",
        },
        {
          type: "text",
          name: "link",
          message:
            gradient.vice(
              `Optional - `
            ) +
            gradient.fruit(
              `Enter the URL you want the badge to direct to:`
            ),
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
      console.log(gradient.cristal("Custom badge created:"));
      console.log();
      console.log(gradient.cristal("Markdown:"));
      console.log(chalk.hex("#FFBF00").bold(badgeMarkdown)); // displays the code with users' inputs
      console.log();
      console.log(gradient.cristal("HTML:"));
      console.log(chalk.hex("#FFBF00").bold(badgeHtml));
      console.log();
    } catch (error) {
      console.error(`Error creating custom badge: ${error.message}`);
    }
  });

  program
  .command('about')
  .alias('abt')
  .description('Displays general information about the package.')
  .action(async () => {
    async function displayAboutInfo() {
      try {
        const response = await axios.get(`https://registry.npmjs.org/mdbadges-cli`);
        const latestVersion = response.data["dist-tags"].latest;

        console.log();
        console.log(gradient.vice('                 _  _                 _                                 _  _ '));
        console.log(gradient.vice('                | || |               | |                               | |(_) '));
        console.log(gradient.vice('  _ __ ___    __| || |__    __ _   __| |  __ _   ___  ___  ______  ___ | | _ '));
        console.log(gradient.vice(' | \'_ ` _ \\  / _` || \'_ \\  / _` | / _` | / _` | / _ \\/ __||______|/ __|| || |'));
        console.log(gradient.vice(' | | | | | || (_| || |_) || (_| || (_| || (_| ||  __/\\__ \\       | (__ | || |'));
        console.log(gradient.vice(' |_| |_| |_| \\__,_||_.__/  \\__,_| \\__,_| \\__, | \\___||___/        \\___||_||_|'));
        console.log(gradient.vice('                                          __/ |                              '));
        console.log(gradient.vice('                                         |___/                               '));
        console.log();
        console.log(gradient.vice('                 Find badges without ever leaving the terminal.                     '));    
        console.log(gradient.vice('                            https://cli.inttter.com                            '));
        console.log();
        console.log(gradient.retro(`Latest Version: ${latestVersion}`));

        const userPackageVersion = packageInfo.version;
        console.log(gradient.cristal(`Your Version: ${userPackageVersion}`));
        console.log();
        console.log(gradient.atlas(`If you need to, update by running 'mdb update' or 'mdb upd'`));
        console.log();
        console.log(gradient.atlas(`License: https://mit-license.org/`));
        console.log();
        console.log(gradient.atlas(`Type 'mdb -h' to view the available list of commands`));
        console.log(gradient.atlas(`Type 'mdb fund' if you'd like to donate`));
        console.log();
        console.log(gradient.atlas(`Report any issues on GitHub: https://github.com/inttter/mdbadges-cli/issues`));
        console.log(gradient.atlas(`To add a badge, view the contributing guidelines: http://tinyurl.com/mdbcontributing`));
      } catch (error) {
        console.error(`Error fetching latest version: ${error.message}`);
      }
    }

    // Call the function
    await displayAboutInfo();
  });

  program
  .command('random')
  .alias('r')
  .description('Displays a random badge.')
  .option('-c, --category', 'Brings up a prompt with the categories')
  .action(async (options) => {
    // the logic below is for --category/-c
    if (options.category) {
      const categoryPrompt = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedCategory',
          message: gradient.fruit('Choose a category:'),
          choices: Object.keys(badges),
          // turns out formatCategoryName seems to break it here
        },
      ]);

      const selectedCategory = categoryPrompt.selectedCategory.toLowerCase();

      if (!badges[selectedCategory]) {
        console.log(`No badges found in the selected category: ${selectedCategory}`);
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
      console.log(gradient.cristal('Markdown:'), gradient.vice(markdownBadge));
      console.log();
      console.log(gradient.cristal('HTML:'), gradient.vice(htmlBadge));
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
      console.log(gradient.cristal('Markdown:'), gradient.vice(markdownBadge));
      console.log();
      console.log(gradient.cristal('HTML:'), gradient.vice(htmlBadge));
    }
  });

program
  .command("copy <category> <badgeName>")
  .alias("c")
  .description("Copies a badge's code to the clipboard.")
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
        chalk.hex("#10F66C").bold(`Copied to the clipboard successfully.`),
      );
      console.log(
        chalk.blueBright(`Press 'Ctrl + V' to paste the copied code.`),
      );
      console.log();
    } else {
      console.log();
      console.log(chalk.hex("#FF0000")(`Badge not found.`));
      console.log();
      console.log(
        chalk.hex("#289FF9")(
          `Try running ${gradient.vice(`mdb search ${category}`)} for a full list of badges in this category.`,
        ),
      );
      console.log();
    }
  });

  program
  .command("lookup <query>")
  .alias("l")
  .description("Displays badges containing a certain keyword/phrase.")
  .action(async (query) => {
    let badgeChoices = [];
    Object.keys(badges).forEach((category) => {
      const categoryData = badges[category];
      Object.keys(categoryData).forEach((badgeName) => {
        if (badgeName.toLowerCase().includes(query.toLowerCase())) {
          const formattedCategory = formatCategoryName(category);
          const formattedBadge = formatBadgeName(badgeName);
          badgeChoices.push({
            name: `• ${gradient.retro(formattedBadge)} in ${gradient.vice(formattedCategory)}`,
            value: categoryData[badgeName], // Store the badge code as the value
          });
        }
      });
    });

    if (!badgeChoices.length) {
      console.log();
      console.log(chalk.hex("#FF0000")(`No badges found with that phrase.`));
      console.log();
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
      console.log(gradient.cristal('Badge found:'));
      console.log(gradient.vice(selectedBadge));
      console.log();
    }
  });

  program
  .command("add <category> <badgeName> [filePath]")
  .description("Allows you to add a badge to a Markdown file.")
  .action((category, badgeName, filePath = "README.md") => {
    const formattedCategory = formatCategoryName(category);
    const categoryData = badges[category.toLowerCase()];

    if (!categoryData) {
      console.log(chalk.hex("#FF0000")(`Category "${formattedCategory}" not found.`));
      return;
    }

    const formattedBadgeName = badgeName.toLowerCase();
    const foundBadge = Object.keys(categoryData).find(
      (key) => key.toLowerCase() === formattedBadgeName,
    );

    if (!foundBadge) {
      console.log(chalk.hex("#FF0000")(`Badge "${formattedBadgeName}" not found.`));
      console.log(
        chalk.hex("#289FF9")(
          `Try running ${gradient.vice(`"mdb search ${category}"`)} for a full list of badges in this category.`,
        )
      );
      return;
    }

    const badge = categoryData[foundBadge];

    // this checks if the badge is defined + if the regex match is successful
    const badgeLinkMatch = badge.match(/\(([^)]+)\)/);
    if (!badgeLinkMatch || !badgeLinkMatch[1]) {
      console.log(chalk.hex("#FF0000")("Badge link not found in the expected format."));
      return;
    }

    // extracts the badge link and its name
    const badgeLink = badgeLinkMatch[1];
    const badgeAlt = badge.match(/\[([^)]+)\]/)[1];

    const badgeMarkdown = `[${badgeAlt}](${badgeLink})](#)`;

    // Check if the specified file has the ".md" extension
    if (!filePath.toLowerCase().endsWith(".md")) {
      console.log(chalk.hex("#FF0000")(`Invalid file. Please provide a Markdown file with a ".md" extension.`));
    return;
  }

    // reads the existing content of the file
    const fs = require("fs");
    let fileContent = "";
    try {
      fileContent = fs.readFileSync(filePath, "utf8");
    } catch (error) {
      console.error(chalk.hex("#FF0000")(`Error reading the file: ${error.message}`));
      return;
    }

    // adds the badge to the file
    try {
      fs.appendFileSync(filePath, `\n${badgeMarkdown}\n`, "utf8");
      console.log()
      console.log(gradient.cristal("Badge added to the file successfully."));
      console.log()
    } catch (error) {
      console.error(chalk.hex("#FF0000")(`Error writing to the file: ${error.message}`));
    }
  });

  program
  .command('documentation')
  .alias('docs')
  .description('Opens a link to the documentation in your browser.')
  .action(async () => {
    console.log();
    const spinner = ora({
      text: chalk.hex("#289FF9")("Opening the documentation in your browser..."),
      color: "yellow",
  }).start();

  try {
    await open("https://inttter.gitbook.io/mdbadges-cli");

    spinner.succeed(chalk.hex("#10F66C")("Opened in your browser!"));
  } catch (error) {
    spinner.fail("An error occurred opening the link in your browser.");
    console.error(chalk.red(`${error.message}`));
  } finally {
    setTimeout(() => {
      console.log();
      console.log(gradient.cristal('Hasn\'t opened in your browser? Try clicking on the link below:'));
      console.log(chalk.hex("#10F66C").bold(`https://inttter.gitbook.io/mdbadges-cli`));
    }, 5000) // 5 seconds
  }
});

program.parse(process.argv);