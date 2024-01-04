#!/usr/bin/env node

const { program } = require('commander');
const axios = require('axios');
const chalk = require('chalk');
const badges = require('./badges');
const packageInfo = require('./package.json');

function formatCategoryName(category) {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const frames = ['/', '-', '\\', '|']; // Different frames for animation
let index = 0;

program
    .version('2.0.0')
    .description('A command line tool to find Shield.io badges.');

    program
    .arguments('<category> <badgeName>')
    .option('--html', 'Generate HTML badge code')
    .action((category, badgeName, options) => {
      const formattedCategory = formatCategoryName(category);
      const categoryData = badges[category.toLowerCase()];
      if (categoryData) {
        const badge = categoryData[badgeName.toLowerCase()];
        if (badge) {
          if (options.html) {
            // extracts badge link
            const badgeLink = badge.match(/\(([^)]+)\)/)[1];
            // extracts badge namen
            const badgeAlt = badge.match(/\[([^)]+)\]/)[1];
            // formats the HTML
            const htmlBadge = `<img src="${badgeLink}" />`;
            console.log(htmlBadge);
          } else {
            console.log(chalk.hex('#00FF00')(`Badge found for "${formattedCategory}" category:`, badge));
          }
        } else {
          console.log(``);
          console.log(chalk.hex('FF0000')(`Badge not found for "${formattedCategory}" category with the specified name.`));
          console.log(``);
          console.log(`If your name has a space, try entering a dash.`);
          console.log(`eg. applemusic -> apple-music`);
          console.log(``);
        }
      } else {
        console.log(`Category "${formattedCategory}" not found.`);
      }
    });

    program
    .command('fund')
    .description('Shows funding information for the project.')
    .action(() => {
        console.log('');
        console.log('If you would like, you can donate to me here:');
        console.log('');
        console.log('Buy Me A Coffee: https://www.buymeacoffee.com/intter');
        console.log('GitHub Sponsors: https://github.com/sponsors/inttter');
        console.log('Ko-fi: https://ko-fi.com/intter');
        console.log('');
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
        console.log(`You can view the badge list at any of the following two links:`);
        console.log(``);
        console.log(`https://github.com/inttter/md-badges`);
        console.log(`https://docs.inttter.com/content/badges`);
        console.log(``);
    });
  
    program
    .command('update')
    .alias('upd')
    .description('Checks for updates to the CLI.')
    .action(async () => {
        // Start the loading animation
        const loadingInterval = setInterval(() => {
            process.stdout.write('\r' + chalk.blueBright('Checking for updates... ') + frames[index]);
            index = (index + 1) % frames.length;
        }, 100); // Change the interval for speed
      try {
        const response = await axios.get('https://registry.npmjs.org/mdbadges-cli');
        const latest = response.data['dist-tags'].latest;
        if (latest > packageInfo.version) {
          console.log(`A new version (${latest}) is available.`);
          console.log('Please update by running: npm install -g mdbadges-cli@latest');
        } else {
          console.log('')
          console.log('You are already using the latest version.');
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
      console.log(``);
    });
  });
  
  program.parse(process.argv);