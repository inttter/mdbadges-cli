#!/usr/bin/env node

const { program } = require('commander');
const axios = require('axios');
const badges = require('./badges');
const packageInfo = require('./package.json');

function formatCategoryName(category) {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

program
    .version('1.1.0')
    .description('A command line tool to find Shield.io badges.');

program
    .arguments('<category> <badgeName>')
    .action((category, badgeName) => {
        const formattedCategory = formatCategoryName(category);
        const categoryData = badges[category.toLowerCase()];
        if (categoryData) {
            const badge = categoryData[badgeName.toLowerCase()];
            if (badge) {
                console.log(`Badge found for "${formattedCategory}" category:`, badge);
            } else {
                console.log(``);
                console.log(`Badge not found for "${formattedCategory}" category with the specified name.`);
                console.log(``);
                console.log(`If your name has a space, try entering a dash.`);
                console.log(`eg. applemusic -> apple-music`);
            }
        } else {
            console.log(`Category "${formattedCategory}" not found.`);
        }
    });

program
    .command('fund')
    .description('Shows. funding information for the project.')
    .action(() => {
        console.log('');
        console.log('If you would like, you can donate to me here:');
        console.log('');
        console.log('GitHub Sponsors: https://github.com/sponsors/inttter');
        console.log('');
    });

    program
    .command('version')
    .description('Displays the current version.')
    .action(() => {
        console.log(`${packageInfo.version}`);
    });

    program
    .command('badges')
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
    .description('Checks for updates and updates the CLI.')
    .action(async () => {
      console.log('Checking for updates...');
      try {
        const response = await axios.get('https://registry.npmjs.org/mdbadges-cli');
        const latest = response.data['dist-tags'].latest;
        if (latest > packageInfo.version) {
          console.log(`A new version (${latest}) is available.`);
          console.log('Please update by running: npm install -g mdbadges-cli@latest');
        } else {
          console.log('You are already using the latest version.');
        }
      } catch (error) {
        console.error('Failed to check for updates. Please try again later.');
      }
    });

    program
    .command('search <category>')
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
        } else {
            console.log(`Category "${formattedCategory}" not found.`);
        }
    });

program.parse(process.argv);