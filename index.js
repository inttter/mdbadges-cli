#!/usr/bin/env node

const { program } = require("commander");
const axios = require("axios");
const chalk = require("chalk");
const prompts = require("prompts");
const clipboardy = require("clipboardy");
const ora = require("ora");
const gradient = require("gradient-string");
const badges = require("./badges");
const packageInfo = require("./package.json");

function formatCategoryName(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatBadgeName(badgeName) {
  const formattedBadgeName = badgeName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return formattedBadgeName;
}

program.version("3.1.1").description("A package to find Shields.io badges.");

program
  .arguments("<category> [badgeNames...]")
  .description("Displays Markdown for specified badge in a category.")
  .option("--html", "Generates the HTML version of the badge code") // tag that toggles html code
  .option("-s, --style <badgeStyle>", "Toggles badge style") // tags that toggle badge style
  .action((category, badgeNames = [], options) => {
    const formattedCategory = formatCategoryName(category);
    const categoryData = badges[category.toLowerCase()];

    if (categoryData) {
      badgeNames.forEach((badgeName) => {
        const formattedBadgeName = badgeName.toLowerCase();
        const foundBadge = Object.keys(categoryData).find(
          (key) => key.toLowerCase() === formattedBadgeName,
        );
        const badge = categoryData[foundBadge];

        if (badge) {
          if (options.html) {
            // Extracts the badge link and its name
            const badgeLink = badge.match(/\(([^)]+)\)/)[1];
            const badgeAlt = badge.match(/\[([^)]+)\]/)[1];
            // Formats the HTML code with style option
            const styleOption = options.style ? `&style=${options.style}` : "";
            const htmlBadge = `<img src="${badgeLink}${styleOption}" />`;
            console.log();
            console.log(gradient.cristal(`Badge found:`));
            console.log(chalk.hex("#FFBF00")(htmlBadge));
            console.log();
          } else {
            let badgeStyle = "flat"; // flat is the default style if one is not specified
            if (options.style) {
              // Checks if the provided style matches one of the accepted styles
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
            const badgeMarkdown = `[${badgeAlt}](${badgeLink}${styleOption})](#)`;
            console.log();
            console.log(gradient.cristal(`Badge found:`));
            console.log(chalk.hex("#FFBF00")(badgeMarkdown));
            console.log();
          }
        } else {
          console.log();
          console.log(
            chalk.hex("#FF0000")(
              `Badge "${gradient.cristal(formatBadgeName(badgeName))}" not found.`,
            ),
          );
          console.log();
          console.log(
            chalk.hex("#289FF9")(
              `If your name has a space, try entering a dash.`,
            ),
          );
          console.log(chalk.hex("#289FF9")(`e.g., applemusic -> apple-music`));
          console.log();
        }
      });
    } else {
      console.log();
      console.log(chalk.hex("#FF0000")(`That category could not be found.`));
      console.log();
      console.log(
        chalk.hex("#289FF9")(
          `Run ${gradient.vice("mdb categories")} for a list of categories.`,
        ),
      );
      console.log();
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
  .alias("v")
  .description("Displays the current version you are on.")
  .action(() => {
    console.log();
    console.log(`${packageInfo.version}`); // fetches package info version from package.json
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
    console.log(chalk.hex("#10F66C")(`https://github.com/inttter/md-badges`));
    console.log(
      chalk.hex("#10F66C")(`https://docs.inttter.com/content/badges`),
    );
    console.log();
  });

program
  .command("update")
  .alias("upd")
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
          chalk.hex("#10F66C")("You are already on the latest version."),
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
  .command("search <category>")
  .alias("s")
  .alias("find")
  .description("Displays badges available in a category.")
  .action((category) => {
    const formattedCategory = formatCategoryName(category);
    const categoryData = badges[category.toLowerCase()];
    if (categoryData) {
      console.log();
      console.log(gradient.cristal(`Badges available:`));
      console.log();
      Object.keys(categoryData).forEach((badge) => {
        console.log(gradient.cristal(`- ${badge}`));
      });
      console.log(
        chalk.hex("#289FF9")(
          `\nTo get the code for a badge, type 'mdb ${category} <badgeName>'.`,
        ),
      );
      console.log(
        chalk.hex("#289FF9")(
          `If you want the HTML version of a badge, type 'mdb --html ${category} <badgeName>'.`,
        ),
      );
      console.log();
    } else {
      console.log(chalk.hex("#FF0000")(`That category could not be found.`));
      console.log();
    }
  });

program
  .command("categories")
  .alias("cat")
  .description("Displays a list of all available categories.")
  .action(() => {
    console.log();
    console.log(gradient.cristal("Available categories:"));
    console.log();
    Object.keys(badges).forEach((category) => {
      console.log(gradient.vice(`• ${formatCategoryName(category)}`)); // displays each category in bullet points (formatted)
    });
    console.log();
  });

program
  .command("create")
  .description("Displays prompts to create your own badge.")
  .action(async () => {
    const prompt = require("prompts");

    const response = await prompt([
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
          "Enter the color or hexadecimal value for the badge:",
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
        type: "text",
        name: "style",
        message: gradient.fruit("Enter the style of the badge:"),
        validate: (value) => {
          const lowerCaseValue = value.toLowerCase();
          const allowedStyles = [
            "flat",
            "flat-square",
            "plastic",
            "social",
            "for-the-badge",
          ];
          if (!allowedStyles.includes(lowerCaseValue)) {
            return `Invalid style. Please enter one of the following: ${allowedStyles.join(", ")}`;
          } else if (!value.trim()) {
            return "This field is required.";
          }
          return true;
        },
      },
      {
        type: "text",
        name: "link",
        message:
          gradient.vice(`Optional - `) +
          gradient.fruit(`Enter the URL you want the badge to direct to:`),
        initial: "",
      },
      {
        type: "text",
        name: "logoColor",
        message:
          gradient.fruit("Enter the logo color for the badge ") +
          gradient.vice("(default is white):"),
        initial: "white",
        validate: (value) => {
          if (!value.trim()) {
            return "This field is required.";
          }
          return true;
        },
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
  .command("about")
  .description("Displays general information about the package.")
  .action(() => {
    // prettier-ignore
    console.log(`
      ${gradient.vice("                 _  _                 _                                 _  _ ")}
      ${gradient.vice("                | || |               | |                               | |(_) ")}
      ${gradient.vice("  _ __ ___    __| || |__    __ _   __| |  __ _   ___  ___  ______  ___ | | _ ")}
      ${gradient.vice(" | '_ \` _ \\  / _\` || '_ \\  / _\` | / _\` | / _\` | / _ \\/ __||______|/ __|| || |")}
      ${gradient.vice(" | | | | | || (_| || |_) || (_| || (_| || (_| ||  __/\\__ \\       | (__ | || |")}
      ${gradient.vice(" |_| |_| |_| \\__,_||_.__/  \\__,_| \\__,_| \\__, | \\___||___/        \\___||_||_|")}
      ${gradient.vice("                                          __/ |                              ")}
      ${gradient.vice("                                         |___/                               ")}
      
      ${gradient.vice("                      A package to find Shields.io badges.                      ")}
      ${gradient.vice("                            https://cli.inttter.com                            ")}
    `);
  });
    console.log();
    console.log(gradient.retro(`Latest Version: ${packageInfo.version}`));

    const userPackageVersion = packageInfo.version;
    console.log(
      gradient.summer(`You are currently using version: ${userPackageVersion}`),
    );
    console.log();
    console.log(
      gradient.atlas(
        `If you need to, update by running 'mdb update' or 'mdb upd'`,
      ),
    );
    console.log();
    console.log(gradient.atlas(`License: https://mit-license.org/`));
    console.log();
    console.log(
      gradient.atlas(`Type 'mdb -h' to view the available list of commands`),
    );
    console.log(gradient.atlas(`Type 'mdb fund' if you'd like to donate`));
    console.log();
    console.log(
      gradient.atlas(
        `Report any issues on GitHub: https://github.com/inttter/mdbadges-cli/issues`,
      ),
    );
    console.log(
      gradient.atlas(
        `To add a badge, visit this repository: https://github.com/inttter/md-badges`,
      ),
    );

program
  .command("random")
  .alias("r")
  .description("Displays a random badge.")
  .action(() => {
    const categories = Object.keys(badges);
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)]; // chooses a random badge
    const badgesInCategory = Object.keys(badges[randomCategory]);
    const randomBadgeName =
      badgesInCategory[Math.floor(Math.random() * badgesInCategory.length)];
    const badge = badges[randomCategory][randomBadgeName];

    const badgeLink = badge.match(/\(([^)]+)\)/)[1];
    const badgeAlt = badge.match(/\[([^)]+)\]/)[1];

    const markdownBadge = `[${badgeAlt}](${badgeLink})`;
    const htmlBadge = `<img src="${badgeLink}" />`;

    // this outputs BOTH versions, Markdown and HTML.
    console.log();
    console.log(gradient.cristal("Markdown:"), gradient.vice(markdownBadge)); // outputs Markdown badge
    console.log();
    console.log(gradient.cristal("HTML:"), gradient.vice(htmlBadge)); // outputs HTML badge
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
        chalk.hex("#10F66C")(`Copied to the clipboard successfully.`),
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
      console.log(
        chalk.hex("#289FF9")(
          `You can also try running ${gradient.vice(`mdb categories`)} to view the full list of categories.`,
        ),
      );
      console.log();
    }
  });

program
  .command("lookup <query>")
  .alias("l")
  .description("Displays badges containing a certain keyword/phrase.")
  .action((query) => {
    let found = false;
    Object.keys(badges).forEach((category) => {
      const categoryData = badges[category];
      Object.keys(categoryData).forEach((badgeName) => {
        if (badgeName.toLowerCase().includes(query.toLowerCase())) {
          const formattedCategory = formatCategoryName(category);
          const formattedBadge = formatBadgeName(badgeName);
          console.log(
            `• ${gradient.retro(formattedBadge)} in ${gradient.vice(formattedCategory)}`,
          );
          found = true;
        }
      });
    });

    if (!found) {
      console.log();
      console.log(chalk.hex("#FF0000")(`No badges found with that phrase.`));
      console.log();
    }
  });

program
  .command("contribute")
  .alias("contrib")
  .description("Displays information on how to contribute.")
  .action(() => {
    console.log();
    console.log(gradient.cristal("Contributing to mdbadges-cli:"));
    console.log();
    console.log(chalk.hex("#FFBF00")("View the contributing guidelines here:"));
    console.log(
      gradient.fruit(
        "https://github.com/inttter/mdbadges-cli/blob/main/CONTRIBUTING.md",
      ),
    );
    console.log();
  });

program.parse(process.argv);