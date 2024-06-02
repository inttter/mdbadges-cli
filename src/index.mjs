#!/usr/bin/env -S node --no-warnings=ExperimentalWarning

// shebang: https://github.com/nodejs/node/issues/51347#issuecomment-1893074523

import { program } from 'commander';
import axios from 'axios';
import c from 'chalk';
import clipboardy from 'clipboardy';
import ora from 'ora';
import { select, confirm, text } from '@clack/prompts';
import open from 'open';
import { consola } from 'consola';
import cliSpinners from 'cli-spinners';
import fs from 'fs';
import badges from './badges.mjs';
import * as utils from './utils.mjs';

const packageName = 'mdbadges-cli'

// Main Command
program
  .name('mdb') // name = prefix
  .usage('[category] [badgeName] [--options]')
  .option('--html', 'toggle HTML version of a badge')
  .option('-s, --style <badgeStyle>', 'toggle style of a badge')
  .option('--link', 'toggle links in a badge')
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
          let link = '';

          // --link
          if (options.link) {
            const linkResponse = await text({
              message: badgeNames.length === 1 ? c.cyan('Enter your link here:') : index === 0 ? c.cyan(`Enter your first link here, then click ${c.magenta('Enter')} and type the rest below in correct order:`) : '',
              validate: input => {
                if (!utils.isValidURL(input)) {
                    return "Please enter a valid URL.";
                }
                return;
            }
            });
            link = linkResponse;
            links.push(link);
          }
        } else {
          // don't use new Error() here
          consola.error(c.red(`'${utils.formatBadgeName(badgeName)}' is not a valid badge.`));
          console.log(c.cyan(`Try running ${c.magenta.bold('mdb search')} and selecting '${c.magenta.bold(utils.formatCategoryName(formattedCategory))}' for a list of badges in that category.\n`));
          
          const similarBadges = Object.keys(categoryData).filter(key =>
            key.toLowerCase().includes(badgeName.toLowerCase())
          );

          // prompt for similar badges in the same category if it cant find the badge
          if (similarBadges.length > 0) {
            const selectedBadge = await select({
              message: c.cyan('Did you mean one of these?'),
              options: [
                ...similarBadges.map(similarBadge => ({
                  label: similarBadge,
                  value: (categoryData[similarBadge]),
                })),
                { label: 'None of these', value: 'none' },
              ],
            });

            if (selectedBadge === 'none') {
              process.exit(0);
            } else {
              console.log(c.green.bold('\nBadge found:'));
              console.log(c.hex('#FFBF00').bold(`${selectedBadge}\n`));
            }
          }
        }
      }

      if (badgesFound) {
        console.log(c.green.bold('Badge found:'));
      }

      for (let index = 0; index < badgeNames.length; index++) {
        const badgeName = badgeNames[index];
        const formattedBadgeName = badgeName.toLowerCase();
        const foundBadge = Object.keys(categoryData).find(
          (key) => key.toLowerCase() === formattedBadgeName,
        );
        const badge = categoryData[foundBadge];
      
        if (badge) {
          // --html
          if (options.html) {
            // extracts the badge link and its name
            const badgeLinkMatch = badge.match(/\(([^)]+)\)/);
            const badgeAltMatch = badge.match(/\[([^)]+)\]/);
      
            if (badgeLinkMatch && badgeAltMatch) {
              const badgeLink = badgeLinkMatch[1];
              const badgeAlt = badgeAltMatch[1];
              const htmlBadgeAlt = badgeAlt.replace(/^!\[/, ''); // strips the '![' from the alt text
              
              let styleOption = '';
              if (options.style) {
                styleOption = `&style=${options.style}`;
              }
      
              let htmlBadge;
              if (options.link && links[index]) { // if --link is specified, we append the <a> tags
                htmlBadge = `<a href="${utils.escapeHtml(links[index])}">\n  <img src="${badgeLink}${styleOption}" alt="${utils.escapeHtml(htmlBadgeAlt)}">\n</a>`;
              } else {
                htmlBadge = `<img src="${badgeLink}${styleOption}" alt="${utils.escapeHtml(htmlBadgeAlt)}">`;
              }
              console.log(c.hex('#FFBF00').bold(`${htmlBadge}\n`));
            } else {
              consola.error(new Error(c.red('Could not extract badge link or alt text.')));
            }
          } else {
            // --style
            if (options.style) {
                // provided style must match one of these styles
                const styles = ['flat', 'flat-square', 'plastic', 'social', 'for-the-badge'];
                if (styles.includes(options.style)) {
                    let badgeStyle = '' // don't remove this or it causes badgeStyle to not be defined
                    badgeStyle = options.style;
                } else {
                    consola.warn(c.yellow(`An invalid style was detected.`));
                    console.log(c.yellow(`View available styles at ${c.magenta.bold(' https://docs.mdbcli.xyz/commands/finding-a-badge#style-s')}.`))
                }
            }
            const styleOption = options.style ? `&style=${options.style}` : '';
            const badgeLink = badge.match(/\(([^)]+)\)/)[1];
            const badgeAlt = badge.match(/\[([^)]+)\]/)[1];
            const link = links[index] ? utils.escapeHtml(links[index]) : '#'; // use '#' if link is not provided
        
            const badgeMarkdown = `[${badgeAlt}](${badgeLink}${styleOption})](${link})`;
        
            console.log(c.hex('#FFBF00').bold(`${badgeMarkdown}\n`));
          }
        }
      }
    } else {
      // LookS for the badge in all categories to suggest the correct category
      let badgeFoundInOtherCategory = false;
      let correctCategory = '';
      let foundBadgeName = '';

      for (const cat of Object.keys(badges)) {
        const badgeKeys = Object.keys(badges[cat]);
        const foundBadge = badgeKeys.find(key => badgeNames.includes(key.toLowerCase()));
        if (foundBadge) {
          badgeFoundInOtherCategory = true;
          correctCategory = cat;
          foundBadgeName = foundBadge;
          break;
        }
      }

      // suggests the correct command to run if [badgeName] is valid but [category] is not
      if (badgeFoundInOtherCategory) {
        consola.error(c.red(`The specified category could not be found, but '${c.red.bold(utils.formatBadgeName(foundBadgeName))}' is a valid badge in the '${c.red.bold(utils.formatCategoryName(correctCategory))}' category.`));
        console.log(c.cyan(`Run ${c.magenta.bold(`mdb ${correctCategory} ${foundBadgeName}`)} to get the correct badge code.\n`));
      } else {
        // if neither [category] or [badgeName] is valid
        consola.error(c.red(`The specified badge and category could not be found.`));
        console.log(c.cyan(`Visit ${c.magenta.bold('https://mdbcli.xyz/categories')} for a list of available categories.`));
        console.log(c.cyan(`You can also run ${c.magenta.bold('mdb search')} for a list of available badges within any category.`));
      }
    }
  });

// Badge List Command
program
  .command('badges')
  .alias('list')
  .description('open a link to the badge list in your browser')
  .action(async () => {
    console.log()
    const spinner = ora({
      text: c.blue('Opening in browser...'),
      spinner: cliSpinners.arc,
      color: 'magenta',
    }).start();

    const listLink = 'https://github.com/inttter/md-badges?tab=readme-ov-file#-table-of-contents'

    try {
      await open(listLink);
      spinner.succeed(c.green('Opened in your browser!'));
    } catch (error) {
      consola.error(new Error(c.red(`An error occurred when trying to open the link in your browser: ${error.message}`)));
      console.log(c.cyan(`\n  You can visit the page by clicking on the following link instead: ${c.magenta.bold(listLink)}`))
      spinner.stop()
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

      const selectedCategory = await select({
        message: c.cyan.bold('Select a category:'),
        options: categories.map(category => ({
          label: utils.formatCategoryName(category),
          value: category,
        })),
      });

      const formattedCategory = utils.searchCategory(selectedCategory);
      const categoryData = badges[formattedCategory];

      if (categoryData) {
        console.log(c.green(`\nBadges available in ${c.green.underline(utils.formatCategoryName(selectedCategory))}:\n`));
        Object.keys(categoryData).forEach((badge) => {
          console.log(`• ${badge}`);
        });
        console.log(c.cyan(`\nTo get the ${c.underline('Markdown')} version of a badge, type ${c.magenta(`mdb ${formattedCategory} <badgeName>`)}.\n`));
      } else {
        consola.error(c.red(`The specified category could not be found.`));
      }

      continueSearch = await confirm({
        message: ('Would you like to search another category?'),
        initial: true
      });
    }
  });

// Badge Creator Command
program
  .command('create')
  .alias('generate')
  .description('display prompts to create your own badge')
  .action(async () => {
    try {
      const alt = await text({
        message: c.cyan.bold('Enter the alt text for the badge:'),
      });

      let name = await text({
        message: c.cyan.bold('Enter the text you\'d like to display on the badge:'),
        validate: (value) => {
          if (!value.trim()) {
            return c.red('This field is required.');
          }
          return;
        },
      });

      name = name.replace(/-/g, '--'); // escape dashes
      name = name.replace(/\s/g, '_'); // escape spaces
      name = name.replace(/_/g, '__'); // escape underscores

      const color = await text({
        message: c.cyan.bold('Enter a hexadecimal value for the badge:'),
        validate: (value) => {
          const hexColorRegex = /^#?(?:[0-9a-fA-F]{3}){1,2}$/;
          if (!hexColorRegex.test(value.trim())) {
            return c.red('Enter a valid hexadecimal color [eg. #FDE13B].');
          }
          return;
        },
      });

      const logo = await text({
        message: c.cyan.bold('Enter the logo for the badge:'),
        validate: (value) => {
          if (!value.trim()) {
            return c.red('This field is required.');
          }
          return;
        },
      });

      const style = await select({
        message: c.cyan.bold('Choose the style of the badge:'),
        options: [
          { value: 'flat', label: 'Flat', hint: 'Popular' },
          { value: 'flat-square', label: 'Flat Square' },
          { value: 'plastic', label: 'Plastic' },
          { value: 'social', label: 'Social' },
          { value: 'for-the-badge', label: 'For The Badge', hint: 'Popular' },
        ],
      });

      const logoColor = await text({
        message: c.cyan.bold('Enter the logo color for the badge:'),
        validate: (value) => {
          if (!value.trim()) {
            return c.red('This field is required.');
          }
          return;
        },
      });

      const link = await text({
        message: c.cyan.bold('[Optional] - Enter the URL to redirect to:'),
      });

      let badgeLink = `https://img.shields.io/badge/${name}-${encodeURIComponent(color)}?logo=${encodeURIComponent(logo)}&style=${encodeURIComponent(style)}`;

      if (logoColor) {
        badgeLink += `&logoColor=${encodeURIComponent(logoColor)}`;
      }

      const badgeMarkdown = link ? `[![${alt}](${badgeLink})](${link})` : `[![${alt}](${badgeLink})](#)`;

      const badgeHtml = link ? `<a href="${utils.escapeHtml(link)}">\n  <img src="${badgeLink}" alt="${utils.escapeHtml(alt)}" />\n</a>` : `<img src="${badgeLink}" alt="${utils.escapeHtml(alt)}" />`;

      console.log(c.green.bold('\n✅ Custom badge created successfully!\n'));
      console.log(c.green.bold('Markdown:'));
      console.log(c.hex('#FFBF00').bold(`${badgeMarkdown}\n`)); // Markdown
      console.log(c.green.bold('HTML:'));
      console.log(c.hex('#FFBF00').bold(`${badgeHtml}\n`)); // HTML
    } catch (error) {
      consola.error(new Error(c.red(`An error occurred when trying to make your badge: ${error.message}`)));
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
        const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
        const latestVersion = response.data['dist-tags'].latest;

        // counts the number of badges and saves it in numOfBadges
        let numOfBadges = 0;
        Object.values(badges).forEach(category => {
          numOfBadges += Object.keys(category).length;
        });

        console.log(c.green.bold('\n                    _  _                 _                                 _  _ '));
        console.log(c.green.bold('                    | || |               | |                               | |(_) '));
        console.log(c.green.bold('      _ __ ___    __| || |__    __ _   __| |  __ _   ___  ___  ______  ___ | | _ '));
        console.log(c.green.bold('     | \'_ ` _ \\  / _` || \'_ \\  / _` | / _` | / _` | / _ \\/ __||______|/ __|| || |'));
        console.log(c.green.bold('     | | | | | || (_| || |_) || (_| || (_| || (_| ||  __/\\__ \\       | (__ | || |'));
        console.log(c.green.bold('     |_| |_| |_| \\__,_||_.__/  \\__,_| \\__,_| \\__, | \\___||___/        \\___||_||_|'));
        console.log(c.green.bold('                                              __/ |                              '));
        console.log(c.green.bold('                                             |___/                               \n'));
        console.log(c.blue.bold('An extensive CLI tool to find Shields.io badges without needing to leaving the terminal.'));    
        console.log(c.blue.bold('                               https://mdbcli.xyz                            \n'));
        console.log(c.yellow(`${c.yellow.bold.underline('Latest:')} ${latestVersion}`));

        console.log(c.yellow(`Badges Available: ${c.yellow.bold(numOfBadges)}\n`));

        console.log(c.blue(`• ${c.cyan.bold('mdb help')} to view the available list of commands`));
        console.log(c.blue(`• ${c.cyan.bold('mdb changelog')} to view the latest release`));
        console.log(c.blue(`• ${c.cyan.bold('mdb docs')} to view the documentation\n`))

        console.log(c.blue(`• Issues: ${c.blue.bold.underline(`https://github.com/inttter/${packageName}/issues`)}`));
        console.log(c.blue(`• Contribute: ${c.blue.bold.underline(`https://github.com/inttter/${packageName}/blob/main/CONTRIBUTING.md`)}`));
        console.log(c.blue(`• License: ${c.blue.underline.bold(`https://github.com/inttter/${packageName}/blob/main/LICENSE`)}`));
      } catch (error) {
        consola.error(new Error(c.red(`An error occurred when fetching the latest version: ${error.message}`)));
      }
    }

    // Call the function
    await displayAboutInfo();
  });

/// Random Badge Command
program
  .command('random')
  .alias('r')
  .description('display a random badge')
  .action(async () => {
    const categories = Object.keys(badges);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const badgesInCategory = Object.keys(badges[randomCategory]);
    const randomBadgeName = badgesInCategory[Math.floor(Math.random() * badgesInCategory.length)];
    const badge = badges[randomCategory][randomBadgeName];

    const badgeLink = badge.match(/\(([^)]+)\)/)[1];
    const badgeAlt = badge.match(/\[([^)]+)\]/)[1];

    const markdownBadge = `[${badgeAlt}](${badgeLink})`;
    const htmlBadgeAlt = badgeAlt.replace(/^!\[/, ''); // strips the '![' from the alt text
    const htmlBadge = `<img src="${badgeLink}" alt="${htmlBadgeAlt}" />`;

    // outputs both versions, Markdown and HTML
    console.log(c.green.underline.bold('\nMarkdown:'));
    console.log(c.hex('#FFBF00').bold(`${markdownBadge}\n`));

    console.log(c.green.underline.bold('HTML:'));
    console.log(c.hex('#FFBF00').bold(htmlBadge));
  });

// Copy Command
program
  .command('copy [category] [badgeName]')
  .alias('c')
  .description('copy a badge\'s code to the clipboard')
  .action((category, badgeName) => {
    const formattedCategory = category.toLowerCase();
    const formattedBadgeName = badgeName.toLowerCase();

    if (
      badges[formattedCategory] &&
      badges[formattedCategory][formattedBadgeName]
    ) {
      const selectedBadge = badges[formattedCategory][formattedBadgeName];
      clipboardy.writeSync(selectedBadge);
      console.log(c.green.bold(`\nCopied to the clipboard successfully.\n`));
    } else {
      const validCategory = Object.keys(badges).find(cat =>
        Object.keys(badges[cat]).some(badge => badge.toLowerCase() === formattedBadgeName)
      );

      if (validCategory) {
        consola.error(c.red(`The specified category could not be found, but '${c.red.bold(utils.formatBadgeName(badgeName))}' is a valid badge in the '${c.red.bold(utils.formatCategoryName(validCategory))}' category.`));
        console.log(c.cyan(`Run ${c.magenta.bold(`mdb copy ${validCategory} ${badgeName}`)} to copy the correct badge.\n`));
      } else {
        consola.error(c.red(`The specified badge and category could not be found.`));
        console.log(c.cyan(`Try running ${c.magenta.bold(`mdb search`)} for a list of categories and badges within specific categories.\n`));
      }
    }
  });

// Lookup Command
program
  .command('lookup [keyword]')
  .alias('l')
  .description('display badges containing a certain keyword')
  .action(async (query) => {
    let badgeChoices = [];
    Object.keys(badges).forEach((category) => {
      const categoryData = badges[category];
      Object.keys(categoryData).forEach((badgeName) => {
        if (badgeName.toLowerCase().includes(query.toLowerCase())) {
          const formattedCategory = utils.formatCategoryName(category);
          const formattedBadge = utils.formatBadgeName(badgeName);
          badgeChoices.push({
            name: `${c.green(formattedBadge)} in ${c.yellow(formattedCategory)}`,
            value: categoryData[badgeName], // stores the badge code as the value
          });
        }
      });
    });

    if (!badgeChoices.length) {
      consola.error(c.red('A badge containing that keyword could not be found.'));
    } else {
      const selectedBadge = await select({
        message: c.cyan.bold('Select a badge:'),
        options: badgeChoices.map(badge => ({
          label: badge.name,
          value: badge.value,
        })),
      });

      console.log(c.green.bold('\nBadge found:'));
      console.log(c.hex('#FFBF00').bold(selectedBadge));
    }
  });

// Adding Badge To File Command
program
  .command('add [category] [badgeName] [filePath]')
  .description('add a badge to a Markdown file')
  .action((category, badgeName, filePath) => {
    if (!filePath) {
      // very simple check, so don't use new Error() here
      consola.error(c.red('No file or file path was specified.'));
      return;
    }

    const formattedCategory = utils.formatCategoryName(category);
    const formattedBadgeName = badgeName.toLowerCase();
    const categoryData = badges[category.toLowerCase()];

    if (!categoryData) {
      const validCategory = Object.keys(badges).find(cat =>
        Object.keys(badges[cat]).some(badge => badge.toLowerCase() === formattedBadgeName)
      );

      if (validCategory) {
        consola.error(c.red(`The specified category could not be found, but '${c.red.bold(utils.formatBadgeName(badgeName))}' is a valid badge in the '${c.red.bold(utils.formatCategoryName(validCategory))}' category.`));
        console.log(c.cyan(`Run ${c.magenta.bold(`mdb add ${validCategory} ${badgeName} ${filePath}`)} to add the badge to your file.\n`));
      } else {
        consola.error(c.red(`The category you specified could not be found.`));
        console.log(c.cyan(`You can try visiting the syntax list for the categories here: ${c.magenta.bold('https://mdbcli.xyz/categories')}\n`));
      }
      return;
    }

    const foundBadge = Object.keys(categoryData).find(
      (key) => key.toLowerCase() === formattedBadgeName,
    );

    if (!foundBadge) {
      consola.error(c.red(`The badge you specified could not be found.`));
      console.log(c.cyan(`Try running ${c.magenta.bold(`mdb search`)} for a full list of badges in this category.\n`));
      return;
    }

    const badge = categoryData[foundBadge];

    // checks if the badge is defined and checks if the regex match is successful
    const badgeLinkMatch = badge.match(/\(([^)]+)\)/);
    if (!badgeLinkMatch || !badgeLinkMatch[1]) {
      consola.error(new Error(c.red('The badge link could not be found in the expected format.')));
      return;
    }

    // extracts the badge link and its name
    const badgeLink = badgeLinkMatch[1];
    const badgeAlt = badge.match(/\[([^)]+)\]/)[1];

    const badgeMarkdown = `[${badgeAlt}](${badgeLink})](#)`;

    try {
      let fileContent = '';
      fileContent = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      consola.error(new Error(c.red(`Could not read the file: ${error.message}`)));
      return;
    }

    // appends the badge to the specified file (path)
    try {
      fs.appendFileSync(filePath, `\n${badgeMarkdown}`, 'utf8');
      consola.success(c.green(`Badge has been added to the file successfully.`));
    } catch (error) {
      consola.error(new Error(c.red(`Could not write to the file: ${error.message}`)));
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
      text: c.blue('Opening the documentation in your browser...'),
      spinner: cliSpinners.arc,
      color: 'yellow',
    }).start();

    const docsLink = 'https://docs.mdbcli.xyz/'

    try {
      await open(docsLink);
      spinner.succeed(c.green('Opened in your browser!'));
    } catch (error) {
      consola.error(new Error(c.red(`An error occurred when trying to open the link in your browser: ${error.message}`)));
      console.log(c.cyan(`\n  You can visit the page by clicking on the following link instead: ${c.magenta.bold(docsLink)}`))
      spinner.stop()
    }
  });

// Help Command
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
  .description('open a link to the latest release and it\'s changelog in your browser')
  .action(async () => {
    console.log()
    const spinner = ora({
      text: c.blue('Opening the latest release...'),
      spinner: cliSpinners.arc,
      color: 'magenta',
    }).start();

    const changelogLink = `https://github.com/inttter/${packageName}/releases/latest`

    try {
      await open(changelogLink);
      spinner.succeed(c.green('Opened in your browser!'));
    } catch (error) {
      consola.error(new Error(c.red(`Could not open the link in your browser: ${error.message}`)));
      console.log(c.cyan(`\n  You can visit the page by clicking on the following link instead: ${c.magenta.bold(changelogLink)}`))
      spinner.stop()
    }
  });

program.parse(process.argv);