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
    .version('2.1.1')
    .description('A package to find Shields.io badges.');

    program
    .arguments('<category> <badgeName>')
    .option('--html', 'Generate HTML badge code')
    .option('--style <badgeStyle>', 'Select badge style (flat, flat-square, plastic, social, for-the-badge)')
    .action((category, badgeName, options) => {
      const formattedCategory = formatCategoryName(category);
      const categoryData = badges[category.toLowerCase()];
      if (categoryData) {
        const badge = categoryData[badgeName.toLowerCase()];
        if (badge) {
          if (options.html) {
            // Extract badge link and name
            const badgeLink = badge.match(/\(([^)]+)\)/)[1];
            const badgeAlt = badge.match(/\[([^)]+)\]/)[1];
            // Format the HTML
            const htmlBadge = `<img src="${badgeLink}" />`;
            console.log(htmlBadge);
          } else {
            let badgeStyle = 'flat'; // Default style if not specified
            if (options.style) {
              // Check if the provided style matches one of the accepted styles
              const styles = ['flat', 'flat-square', 'plastic', 'social', 'for-the-badge'];
              if (styles.includes(options.style)) {
                badgeStyle = options.style;
              } else {
                console.log(chalk.hex('#FF0000')('Invalid badge style. Using default (flat).'));
              }
            }
            const styleOption = options.style ? `&style=${options.style}` : ''; // Add style option if provided
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
        console.log(`${packageInfo.version}`);
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
  .description('Displays available commands and what they do.')
  .action(() => {
    console.log('Available commands:');
    program.commands.forEach(cmd => {
      console.log(`${cmd._name}: ${cmd._description}`);
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
      console.log(`• ${formatCategoryName(category)}`);
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
        message: 'Enter your alt text for the badge:',
        initial: 'e.g. Alt Text',
      },
      {
        type: 'text',
        name: 'name',
        message: 'Enter Name for the badge:',
        initial: 'e.g. Discord',
      },
      {
        type: 'text',
        name: 'color',
        message: 'Enter Color or hex value for the badge:',
        initial: 'e.g. #000',
      },
      {
        type: 'text',
        name: 'logo',
        message: 'Enter Logo for the badge:',
        initial: 'e.g. github',
      },
      {
        type: 'text',
        name: 'style',
        message: 'Enter Style for the badge (e.g., flat, plastic, ...):',
        initial: 'flat',
      },
    ]);

    const badgeLink = `https://img.shields.io/badge/${encodeURIComponent(response.name)}-${encodeURIComponent(response.color)}?logo=${encodeURIComponent(response.logo)}&style=${encodeURIComponent(response.style)}`;
    const badgeMarkdown = `[![${response.alt}](${badgeLink})](#)`;

    console.log(chalk.blueBright('Custom badge created:'));
    console.log(chalk.cyan(badgeMarkdown));
  });

  program
  .command('info')
  .description('Displays general information about the package.')
  .action(() => {
    console.log()
    console.log(chalk.hex('#DEADED')(`mdbadges-cli - A package to find Shields.io badges.`));
    console.log()
    console.log(chalk.hex('#6D5ED9')(`Latest Version: ${packageInfo.version}`));
    console.log(chalk.hex('#6D5ED9')(`License: https://mit-license.org/`));
    console.log(chalk.hex('#6D5ED9')(`Based off of md-badges, my other project. View here: https://github.com/inttter/md-badges`));
    console.log()
    console.log(chalk.hex('#6D5ED9')(`Type 'mdb help' to view the available list of commands.`));
  });
  
  program.parse(process.argv);