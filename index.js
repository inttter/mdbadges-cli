#!/usr/bin/env node

const { program } = require('commander');
const badges = require('./badges'); // Import the badges file

// Function to format the category name for better readability
function formatCategoryName(category) {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

program
    .version('1.0.0')
    .description('Generate markdown badges for different categories.');

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
                console.log(``)
                console.log(`Badge not found for "${formattedCategory}" category with the specified name.`);
                console.log(``);
                console.log(`If your name has a space, try entering a dash.`);
                console.log(``)
                console.log(`eg. applemusic -> apple-music`);
            }
        } else {
            console.log(`Category "${formattedCategory}" not found.`);
        }
    });
program.parse(process.argv);