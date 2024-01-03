#!/usr/bin/env node

const { program } = require('commander');
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


program.parse(process.argv);