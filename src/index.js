#!/usr/bin/env node

const { program } = require("commander");
const axios = require("axios");
const chalk = require("chalk");
const prompts = require("prompts");
const clipboardy = require("clipboardy");
const ora = require("ora");
const gradient = require("gradient-string");
const fs = require("fs");
const inquirer = require("inquirer");
const badges = require("./badges");
const packageInfo = require("../package.json");

function formatCategoryName(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function SearchCategory(category) {
  return category.toLowerCase().replace(/\s+/g, '-');
}

function formatBadgeName(badgeName) { // formats badge names for outputs
  const formattedBadgeName = badgeName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return formattedBadgeName;
};

program.version("4.2.2").description("Find badges without ever leaving the terminal.");

program
  .arguments("<category> [badgeNames...]") // [badgeNames...] allows for more than one badge
  .description("Displays Markdown for specified badge in a category.")
  .option("--html", "Toggles HTML version of a badge") // tag that toggles html code
  .option("-s, --style <badgeStyle>", "Toggles style of a badge") // tags that toggle badge style
  .option("--link", "Toggles links in a badge") // tag that toggles links in the badge
  .action(async (category, badgeNames = [], options) => {
    const formattedCategory = formatCategoryName(category);
    const categoryData = badges[category.toLowerCase()];

    if (categoryData) {
      console.log();

      const links = [];

      if (options.html && options.link) {
        console.log(chalk.hex("#FF0000")("HTML is not supported for the link option."));
        console.log();
        console.log(chalk.hex("#289FF9")("Instead, you can use <a> tags around your <img> tag."));
        console.log();
        console.log(chalk.hex("#289FF9")("Here's an example:"));
        console.log();
        console.log(gradient.vice('<a href="https://discord.com/">'));
        console.log(gradient.vice('  <img src="https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white&style=for-the-badge" />'));
        console.log(gradient.vice('</a>'));
        console.log()
        return;
      }

      for (let index = 0; index < badgeNames.length; index++) {
        const badgeName = badgeNames[index];
        const formattedBadgeName = badgeName.toLowerCase();
        const foundBadge = Object.keys(categoryData).find(
          (key) => key.toLowerCase() === formattedBadgeName,
        );
        const badge = categoryData[foundBadge];

        if (badge) {
          // Prompt for the link only if --link is specified
          let link = "";
          if (options.link) {
            const linkResponse = await prompts({
              type: "text",
              name: "link",
              // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
              // Little explanation of below:
              //
              // "Enter your link here:" 
              // This will only show if there is one badge in the command (eg. mdb social-media twitter --link)
              //
              // "Enter your first link here, then click Enter and type the rest below:" 
              // This will only show if there is more than one badge in the command (eg. mdb social-media twitter discord youtube --link)
              //
              // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
              `Badge "${gradient.cristal(formatBadgeName(badgeName))}" not found.`,
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

      console.log(gradient.cristal(`Badge found:`));

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
            const badgeLink = badge.match(/\(([^)]+)\)/)[1];
            const badgeAlt = badge.match(/\[([^)]+)\]/)[1];
            // formats the HTML code with its style option
            const styleOption = options.style ? `&style=${options.style}` : "";
            const htmlBadge = `<img src="${badgeLink}${styleOption}" />`;
            console.log(chalk.hex("#FFBF00").bold(htmlBadge));
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
              ? `[${badgeAlt}](${badgeLink}${styleOption})](${links[index]})`
              : `[${badgeAlt}](${badgeLink}${styleOption})](#)`;

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
    console.log(gradient.fruit("Ko-fi: https://ko-fi.com/intter"));
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
  .description("Displays a link to view all the badges.")
  .action(() => {
    console.log();
    console.log(
      gradient.cristal(
        `You can view the badge list at any of the following two links:`,
      ),
    );
    console.log();
    console.log(chalk.hex("#10F66C").bold(`https://github.com/inttter/md-badges`));
    console.log(
      chalk.hex("#10F66C").bold(`https://docs.inttter.com/content/badges`),
    );
    console.log();
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
      const response = await axios.get(
        "https://registry.npmjs.org/mdbadges-cli",
      );
      const latest = response.data["dist-tags"].latest;
      if (latest > packageInfo.version) {
        console.log();
        console.log(`A new version, ${gradient.cristal(latest)} is available.`);
        console.log(
          `Please update by running: ${gradient.cristal("npm install mdbadges-cli@latest")}`,
        );
        console.log();
      } else {
        console.log();
        console.log(
          chalk.hex("#10F66C").bold("You are already on the latest version."),
        );
        console.log();
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

      const formattedCategory = SearchCategory(answers.category);
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
        message: gradient.fruit("Enter the logo for the badge:"),
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
        message:
          gradient.fruit("Enter the logo color for the badge:"),
        initial: "",
      },
      {
        type: "text",
        name: "link",
        message:
          gradient.vice(`Optional - `) +
          gradient.fruit(`Enter the URL you want the badge to direct to:`),
        initial: "",
      },
    ]);

    let badgeLink = `https://img.shields.io/badge/${encodeURIComponent(response.name)}-${encodeURIComponent(response.color)}?logo=${encodeURIComponent(response.logo)}&style=${encodeURIComponent(response.style)}`;
    if (response.logoColor) {
      badgeLink += `&logoColor=${encodeURIComponent(response.logoColor)}`;
    }

    const badgeMarkdown = response.link
      ? `[![${response.alt}](${badgeLink})](${response.link})`
      : `[![${response.alt}](${badgeLink})](#)`;

    console.log();
    console.log(gradient.cristal("Custom badge created:"));
    console.log();
    console.log(gradient.retro(badgeMarkdown)); // displays the code with users' inputs
    console.log();
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

program.parse(process.argv);