#!/usr/bin/env node

const { program } = require('commander');
const axios = require('axios');
const chalk = require('chalk');
const prompts = require('prompts');
const badges = require('./badges');
const packageInfo = require('./package.json');

function formatCategoryName(category) {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const frames = ['/', '-', '\\', '|'];
let index = 0;

program
    .version('2.2.3')
    .description('A package to find Shields.io badges.');

    program
    .arguments('<category> <badgeName>')
    .option('--html', 'Generate HTML badge code') // tag that toggles html code
    .option('-s, --style <badgeStyle>', 'Toggles badge style (flat, flat-square, plastic, social, for-the-badge)') // tags that toggle badge style  
    .action((category, badgeName, options) => {
      const formattedCategory = formatCategoryName(category);
      const categoryData = badges[category.toLowerCase()];
      if (categoryData) {
        const badge = categoryData[badgeName.toLowerCase()];
        if (badge) {
          if (options.html) {
            // extracts the badge link and its name
            const badgeLink = badge.match(/\(([^)]+)\)/)[1];
            const badgeAlt = badge.match(/\[([^)]+)\]/)[1];
            // formats the HTML code
            const htmlBadge = `<img src="${badgeLink}" />`;
            console.log(htmlBadge);
          } else {
            let badgeStyle = 'flat'; // flat is the default style if one is not specified
            if (options.style) {
              // checks if the provided style matches one of the accepted styles
              const styles = ['flat', 'flat-square', 'plastic', 'social', 'for-the-badge'];
              if (styles.includes(options.style)) {
                badgeStyle = options.style;
              } else {
                console.log(chalk.hex('#FF0000')('Invalid badge style. Using default (flat).'));
              }
            }
            const styleOption = options.style ? `&style=${options.style}` : ''; // adds style option if one is provided
            const badgeLink = badge.match(/\(([^)]+)\)/)[1];
            const badgeAlt = badge.match(/\[([^)]+)\]/)[1];
            const badgeMarkdown = `[${badgeAlt}](${badgeLink}${styleOption})](#)`;
            console.log(chalk.hex('#10F66C')(`Badge found for "${formattedCategory}" category with style "${badgeStyle}":`, badgeMarkdown));
          }
        } else {
          console.log();
          console.log(chalk.hex('#FF0000')(`Badge not found for "${formattedCategory}" category with the specified name.`));
          console.log();
          console.log(chalk.hex('#289FF9')(`If your name has a space, try entering a dash.`));
          console.log(chalk.hex('#289FF9')(`eg. applemusic -> apple-music`));
          console.log();
        }
      } else {
        console.log(`Category "${formattedCategory}" not found.`);
      }
    });
    
    program
    .command('fund')
    .description('Shows funding information for the package.')
    .action(() => {
        console.log();
        console.log('If you would like, you can donate to me here:');
        console.log();
        console.log(chalk.hex('#FFBF00')('Buy Me A Coffee: https://www.buymeacoffee.com/intter'));
        console.log(chalk.hex('#FFBF00')('GitHub Sponsors: https://github.com/sponsors/inttter'));
        console.log(chalk.hex('#FFBF00')('Ko-fi: https://ko-fi.com/intter'));
        console.log();
    });
  
  program
    .command('version')
    .alias('v')
    .description('Displays the current version.')
    .action(() => {
        console.log(`${packageInfo.version}`); // fetches package info version from package.json
    });
  
  program
    .command('badges')
    .alias('list')
    .description('Displays a link to view all the badges.')
    .action(() => {
        console.log(chalk.hex('#60AF70')(`You can view the badge list at any of the following two links:`));
        console.log();
        console.log(chalk.hex('#10F66C')(`https://github.com/inttter/md-badges`));
        console.log(chalk.hex('#10F66C')(`https://docs.inttter.com/content/badges`));
        console.log();
    });
  
    program
    .command('update')
    .alias('upd')
    .description('Checks for updates to the package.')
    .action(async () => {
        // starts the animation
        const loadingInterval = setInterval(() => {
            process.stdout.write('\r' + chalk.blueBright('Checking for updates... ') + frames[index]);
            index = (index + 1) % frames.length;
        }, 100); // changes the interval for speed
      try {
        const response = await axios.get('https://registry.npmjs.org/mdbadges-cli');
        const latest = response.data['dist-tags'].latest;
        if (latest > packageInfo.version) {
          console.log(`A new version, (${latest}) is available.`);
          console.log('Please update by running: npm install -g mdbadges-cli@latest');
        } else {
          console.log()
          console.log(chalk.hex('#10F66C')('You are already using the latest version.'));
        }
      } catch (error) {
        console.error('Failed to check for updates. Please try again later.');
      } finally {
        clearInterval(loadingInterval);
      }
      
    });
  
  program
    .command('search <category>')
    .alias('s')
    .alias('find')
    .description('Searches for badges available in a specific category.')
    .action((category) => {
        const formattedCategory = formatCategoryName(category);
        const categoryData = badges[category.toLowerCase()];
        if (categoryData) {
            console.log(`Badges available in the "${formattedCategory}" category:`);
            Object.keys(categoryData).forEach((badge) => {
                console.log(`- ${badge}`);
            });
            console.log(`\nTo get the code for a badge, type 'mdb ${category} <badgeName>'.`);
            console.log(`If you want the HTML version of a badge, type 'mdb --html ${category} <badgeName>'.`);
        } else {
            console.log(`Category "${formattedCategory}" not found.`);
        }
    });

  program
  .command('help')
  .alias('h')
  .description('Displays available commands and what they do.')
  .action(() => {
    console.log('Available commands:');
    program.commands.forEach(cmd => {
      console.log(`${cmd._name}: ${cmd._description}`); // log that displays available commands
      console.log();
    });
  });

  program
  .command('categories')
  .alias('cat')
  .description('Displays available categories.')
  .action(() => {
    console.log('Available categories:');
    Object.keys(badges).forEach(category => {
      console.log(`• ${formatCategoryName(category)}`); // displays each category in bullet points (formatted)
    });
  });

  program
  .command('create')
  .description('Gives prompts to create your own badge (markdown only).')
  .action(async () => {
    const prompt = require('prompts');

    const response = await prompt([
      {
        type: 'text',
        name: 'alt',
        message: 'Enter the Alt Text for the badge (e.g. ![Alt Text]):',
        validate: value => {
          if (!value.trim()) {
            return 'Alt text is required.';
          }
          return true;
        }
      },
      {
        type: 'text',
        name: 'name',
        message: 'Enter the text you\'d like to display on the badge:',
        validate: value => {
          if (!value.trim()) {
            return 'Text is required.';
          }
          return true;
        }
      },
      {
        type: 'text',
        name: 'color',
        message: 'Enter the color or hexadecimal value for the badge:',
        validate: value => {
          if (!value.trim()) {
            return 'Color is required. Please enter a (valid) color. For example: #fff, #000000, red';
          }
          return true;
        }
      },
      {
        type: 'text',
        name: 'logo',
        message: 'Enter the logo for the badge:',
        validate: value => {
          if (!value.trim()) {
            return 'Logo is required.';
          }
          return true;
        }
      },
      {
        type: 'text',
        name: 'style',
        message: 'Enter the style of the badge:',
        validate: value => {
          const lowerCaseValue = value.toLowerCase();
          const allowedStyles = ['flat', 'flat-square', 'plastic', 'social', 'for-the-badge'];
          if (!allowedStyles.includes(lowerCaseValue)) {
            return `Invalid style. Please enter one of the following: ${allowedStyles.join(', ')}`;
          }
          return true;
        }
      },
      {
        type: 'text',
        name: 'link',
        message: '(Optional): Enter the URL you want the badge to direct to:',
        initial: '',
      },
      {
        type: 'text',
        name: 'logoColor',
        message: 'Enter the logo color for the badge (default is white):',
        initial: 'white',
        validate: value => {
          if (!value.trim()) {
            return 'Logo color is required.';
          }
          return true;
        }
      },
    ]);
  
    let badgeLink = `https://img.shields.io/badge/${encodeURIComponent(response.name)}-${encodeURIComponent(response.color)}?logo=${encodeURIComponent(response.logo)}&style=${encodeURIComponent(response.style)}`;
    if (response.logoColor) {
      badgeLink += `&logoColor=${encodeURIComponent(response.logoColor)}`;
    }
  
    const badgeMarkdown = response.link
      ? `[![${response.alt}](${badgeLink})](${response.link})`
      : `[![${response.alt}](${badgeLink})](#)`;
  
    console.log(chalk.blueBright('Custom badge created:'));
    console.log(chalk.cyan(badgeMarkdown)); // displays the code with users' inputs
  });

  program
  .command('about')
  .description('Displays general information about the package.')
  .action(() => {
    console.log()
    console.log(chalk.hex('#DEADED')('                 _  _                 _                                 _  _ '));
    console.log(chalk.hex('#DEADED')('                | || |               | |                               | |(_) '));
    console.log(chalk.hex('#DEADED')('  _ __ ___    __| || |__    __ _   __| |  __ _   ___  ___  ______  ___ | | _ '));
    console.log(chalk.hex('#DEADED')(' | \'_ ` _ \\  / _` || \'_ \\  / _` | / _` | / _` | / _ \\/ __||______|/ __|| || |'));
    console.log(chalk.hex('#DEADED')(' | | | | | || (_| || |_) || (_| || (_| || (_| ||  __/\\__ \\       | (__ | || |'));
    console.log(chalk.hex('#DEADED')(' |_| |_| |_| \\__,_||_.__/  \\__,_| \\__,_| \\__, | \\___||___/        \\___||_||_|'));
    console.log(chalk.hex('#DEADED')('                                          __/ |                              '));
    console.log(chalk.hex('#DEADED')('                                         |___/                               '));
    console.log()
    console.log(chalk.hex('#DEADED')('                      A package to find Shields.io badges.                      '));    
    console.log(chalk.hex('#DEADED')('                            https://cli.inttter.com                            '))
    console.log()
    console.log(chalk.hex('#6D5ED9')(`Latest Version: ${packageInfo.version}`));
    
    const userPackageVersion = packageInfo.version;
    console.log(chalk.hex('#6D5ED9')(`You are currently using version: ${userPackageVersion}`));
    
    console.log(chalk.hex('#6D5ED9')(`If you need to, update by running 'mdb update' or 'mdb upd'`));
    console.log()
    console.log(chalk.hex('#6D5ED9')(`License: https://mit-license.org/`));
    console.log()
    console.log(chalk.hex('#6D5ED9')(`Type 'mdb help' or 'mdb -h' to view the available list of commands`));
    console.log(chalk.hex('#6D5ED9')(`Type 'mdb fund' if you'd like to donate`));
    console.log()
    console.log(chalk.hex('#6D5ED9')(`Report any issues on GitHub: https://github.com/inttter/mdbadges-cli/issues`));
    console.log(chalk.hex('#6D5ED9')(`Want to add a badge? Visit this repository and contribute: https://github.com/inttter/md-badges`));
  });

  program
  .command('random')
  .alias('r')
  .description('Displays a random badge in Markdown and HTML formats.')
  .action(() => {
    const categories = Object.keys(badges);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]; // chooses a random badge
    const badgesInCategory = Object.keys(badges[randomCategory]);
    const randomBadgeName = badgesInCategory[Math.floor(Math.random() * badgesInCategory.length)];
    const badge = badges[randomCategory][randomBadgeName];

    const badgeLink = badge.match(/\(([^)]+)\)/)[1];
    const badgeAlt = badge.match(/\[([^)]+)\]/)[1];
    
    const markdownBadge = `[${badgeAlt}](${badgeLink})`;
    const htmlBadge = `<img src="${badgeLink}" />`;

    // this outputs BOTH versions, Markdown and HTML.
    console.log(chalk.hex('#10F66C')('Markdown:'), chalk.hex('#9850E6')(markdownBadge)); // outputs markdown badge
    console.log();
    console.log(chalk.hex('#10F66C')('HTML:'), chalk.hex('#9850E6')(htmlBadge)); // outputs HTML badge
  });

  program.parse(process.argv);