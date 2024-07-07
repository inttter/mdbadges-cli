#!/usr/bin/env -S node --no-warnings=ExperimentalWarning

// shebang: https://github.com/nodejs/node/issues/51347#issuecomment-1893074523

import axios from 'axios';
import badges from './badges.mjs';
import c from 'chalk';
import cliSpinners from 'cli-spinners';
import { consola } from 'consola';
import { confirm, select, text, outro } from '@clack/prompts';
import clipboardy from 'clipboardy';
import fs from 'fs';
import open from 'open';
import ora from 'ora';
import { program } from 'commander';
import * as utils from './utils.mjs';

const packageName = 'mdbadges-cli'

// Main Command
program
  .name('mdb') // name = prefix
  .arguments('[category] [badgeNames...]')
  .usage('[category] [badgeName] [--option]')
  .option('--html', 'toggle HTML version of a badge')
  .option('-s, --style [badgeStyle]', 'toggle style of a badge')
  .option('--link', 'toggle links in a badge')
  .action(async (category, badgeNames = [], options) => {
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
            let linkMessage = '';
            if (badgeNames.length === 1) {
              linkMessage = c.cyan('Enter your link here:');
            } else if (index === 0) {
              linkMessage = c.cyan(`Enter the link for ${c.magenta(utils.formatBadgeName(badgeName))} here:`);
            } else {
              linkMessage = c.cyan(`Enter the link for ${c.magenta(utils.formatBadgeName(badgeName))} (Badge ${index + 1}) here:`);
            }

            const linkResponse = await text({
              message: linkMessage,
              validate: input => {
                if (!utils.isValidURL(input)) {
                  return c.dim('Enter a valid link.');
                }
                return;
              }
            });

            await utils.checkCancellation(linkResponse)

            link = linkResponse;
            links.push(link);
          }
        } else {
          // don't use new Error() here
          consola.error(c.red(`'${utils.formatBadgeName(badgeName)}' is not a valid badge.`));
          console.log(c.cyan(`Try running ${c.magenta.bold('mdb search')} to look for a badge.\n`));
          
          const similarBadges = Object.keys(categoryData).filter(key =>
            key.toLowerCase().includes(badgeName.toLowerCase())
          );

          // prompt for similar badges in the same category if it cant find the badge
          if (similarBadges.length > 0) {
            const selectedBadge = await select({
              message: c.cyan('Did you mean one of these badges instead?'),
              options: [
                ...similarBadges.map(similarBadge => ({
                  label: similarBadge,
                  value: (categoryData[similarBadge]),
                })),
                { label: 'None of these', value: 'none' },
              ],
            });
            
            await utils.checkCancellation(selectedBadge)

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
              
              // for when --style and --html are used together
              let styleOption = '';
              if (options.style) {
                styleOption = `&style=${options.style}`;
              }
      
              // if --link is specified, ppend the <a> tags
              let htmlBadge;
              if (options.link && links[index]) {
                htmlBadge = `<a href="${utils.escapeHtml(links[index])}">\n  <img src="${badgeLink}${styleOption}" alt="${utils.escapeHtml(htmlBadgeAlt)}">\n</a>`;
              } else {
                htmlBadge = `<img src="${badgeLink}${styleOption}" alt="${utils.escapeHtml(htmlBadgeAlt)}">`;
              }
              console.log(c.hex('#FFBF00').bold(`${htmlBadge}\n`));
            } else {
              consola.error(new Error(c.red('Could not extract the badge link or alt text.')));
            }
          } else {
            // --style
            if (options.style) {
                // provided style must match one of these styles
                const styles = ['flat', 'flat-square', 'plastic', 'social', 'for-the-badge'];
                if (styles.includes(options.style)) {
                    let badgeStyle = '';
                    badgeStyle = options.style;
                } else {
                    consola.warn(c.yellow(`An invalid style was detected.`));
                    console.log(c.yellow(`       Available styles are ${c.magenta.bold(styles.join(', '))}\n`))
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
        console.log(c.cyan(`You can also run ${c.magenta.bold('mdb search')} to directly search for a badge.`));
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
  .description('search for badges across any category')
  .action(async () => {
    let continueSearch = true;

    while (continueSearch) {
      const keyword = await text({
        message: c.cyan.bold('Enter a keyword to search for:'),
        validate: (value) => {
          if (!value.trim()) {
            return c.dim('You must enter a keyword.');
          }
          return;
        },
      });

      await utils.checkCancellation(keyword);

      const badgeChoices = [];
      let badgesFound = false;

      Object.keys(badges).forEach((category) => {
        const categoryData = badges[category];
        Object.keys(categoryData).forEach((badgeName) => {
          if (badgeName.toLowerCase().includes(keyword.toLowerCase())) {
            const formattedCategory = utils.formatCategoryName(category);
            const formattedBadge = utils.formatBadgeName(badgeName);
            badgeChoices.push({
              name: `${c.hex('#FFBF00')(formattedBadge)} in ${c.dim(formattedCategory)}`,
              value: categoryData[badgeName], // stores the badge code as the value
            });
            badgesFound = true;
          }
        });
      });

      if (!badgesFound) {
        consola.error(c.red(`No badges containing '${keyword}' could be found.`));
      } else {
        const selectedBadge = await select({
          message: c.cyan.bold('Select a badge:'),
          options: badgeChoices.map(badge => ({
            label: badge.name,
            value: badge.value,
          })),
        });

        await utils.checkCancellation(selectedBadge);

        outro(c.hex('#FFBF00').bold(selectedBadge));
      }

      continueSearch = await confirm({
        message: c.cyan('Would you like to search for another badge?'),
        initial: true
      });

      await utils.checkCancellation(continueSearch);
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
        message: c.cyan.bold('Enter the alt text for the badge:')
      });

      await utils.checkCancellation(alt)

      let name = await text({
        message: c.cyan.bold('Enter the text you would like to display on the badge:'),
        validate: (value) => {
          if (!value.trim()) {
            return c.dim('This field is required.');
          }
          return;
        },
      });

      await utils.checkCancellation(name);

      name = name.replace(/-/g, '--'); // escape dashes
      name = name.replace(/\s/g, '_'); // escape spaces
      name = name.replace(/_/g, '__'); // escape underscores

      const color = await text({
        message: c.cyan.bold('Enter a hexadecimal value for the color of the badge:'),
        validate: (value) => {
          const hexColorRegex = /^#?(?:[0-9a-fA-F]{3}){1,2}$/;
          if (!hexColorRegex.test(value.trim())) {
            return c.dim('Enter a valid hexadecimal color. Valid ones include #d8e, #96f732');
          }
          return;
        },
      });

      await utils.checkCancellation(color)

      const logo = await text({
        message: c.cyan.bold('Enter the logo to be displayed on the badge:'),
        validate: (value) => {
          if (!value.trim()) {
            return c.dim('This field is required.');
          }
          return;
        },
      });

      await utils.checkCancellation(logo)

      const logoColor = await text({
        message: c.cyan.bold('Enter the color for the logo:'),
        validate: (value) => {
          if (!value.trim()) {
            return c.dim('This field is required.');
          }
          return;
        },
      });

      await utils.checkCancellation(logoColor)

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

      await utils.checkCancellation(style)

      const link = await text({
        message: c.cyan.bold('[Optional] - Enter the URL to redirect to when the badge is clicked:'),
      });

      await utils.checkCancellation(link)

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
      consola.error(new Error(c.red(`An error occurred when trying to make the badge: ${error.message}`)));
    }
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
        console.log(c.cyan(`Try running ${c.magenta.bold(`mdb search`)} to directly find a badge.\n`));
      }
    }
  });

// Add Command
program
  .command('add [category] [badgeName] [filePath]')
  .description('add a badge to a Markdown file')
  .action((category, badgeName, filePath) => {
    if (!filePath) {
      // very simple check, so don't use new Error() here
      consola.error(c.red('No file or file path was specified.'));
      return;
    }

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
      console.log(c.cyan(`Try running ${c.magenta.bold(`mdb search`)} to directly find a badge.\n`));
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