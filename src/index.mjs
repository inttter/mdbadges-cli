#!/usr/bin/env -S node --no-warnings=ExperimentalWarning

import badges from './badges.mjs';
import c from 'chalk';
import cliSpinners from 'cli-spinners';
import { consola } from 'consola';
import { confirm, select, text, outro } from '@clack/prompts';
import clipboardy from 'clipboardy';
import fs from 'fs';
import Fuse from 'fuse.js';
import open from 'open';
import ora from 'ora';
import { program } from 'commander';
import * as utils from './utils.mjs';

const packageName = 'mdbadges-cli';

// Main Command
program
  .name('mdb')
  .arguments('[category] [badgeNames...]')
  .usage('[category] [badgeName] [--option]')
  .option('--html', 'toggle HTML version of a badge')
  .option('-s, --style [badgeStyle]', 'toggle style of a badge')
  .option('--link', 'toggle links in a badge')
  .action(async (category, badgeNames = [], options) => {
    const categoryData = badges[utils.searchCategory(category)];
    const styles = ['flat', 'flat-square', 'plastic', 'social', 'for-the-badge'];

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
              validate: input => utils.isValidURL(input) ? undefined : c.dim('Enter a valid link.'),
            });

            // Slightly space out badge and prompt
            console.log();

            await utils.checkCancellation(linkResponse);

            link = linkResponse;
            links.push(link);
          }
        } else {
          consola.error(c.red(`'${utils.formatBadgeName(badgeName)}' is not a valid badge.`));
          console.log(c.cyan(`Try running ${c.magenta.bold('mdb search')} to look for a badge.\n`));
          
          const fuseOptions = {
            keys: ['name'],
            threshold: 0.3,
          };

          const fuse = new Fuse(Object.keys(categoryData).map(key => ({
            name: key,
            value: categoryData[key],
          })), fuseOptions);

          const similarBadges = fuse.search(badgeName).map(result => ({
            label: utils.formatBadgeName(result.item.name),
            value: result.item.value,
          }));

          if (similarBadges.length > 0) {
            const selectedBadge = await select({
              message: c.cyan('Did you mean one of these badges instead?'),
              options: [
                ...similarBadges,
                { label: 'None of these', value: 'none' },
              ],
            });

            await utils.checkCancellation(selectedBadge);

            if (selectedBadge !== 'none') {
              const styleOption = options.style && styles.includes(options.style) ? options.style : '';
              const { badgeMarkdown, htmlBadge } = utils.formatBadge(selectedBadge, styleOption, options.link ? links[badgeNames.indexOf(selectedBadge)] : '');

              if (options.html) {
                outro(c.hex('#FFBF00').bold(`${htmlBadge}`));
              } else {
                outro(c.hex('#FFBF00').bold(`${badgeMarkdown}`));
              }
            } else {
              process.exit(0);
            }
          }
        }
      }

      // Show warning if user gives an invalid style
      if (options.style && !styles.includes(options.style)) {
        consola.warn(c.yellow(`An invalid style was detected. It will not be added to the badge(s).\n       Available styles are: ${c.magenta.bold(styles.join(', '))}`));

        // Remove invalid style
        delete options.style;
      }

      for (let index = 0; index < badgeNames.length; index++) {
        const badgeName = badgeNames[index];
        const formattedBadgeName = badgeName.toLowerCase();
        const foundBadge = Object.keys(categoryData).find(
          (key) => key.toLowerCase() === formattedBadgeName,
        );
        const badge = categoryData[foundBadge];
      
        if (badge) {
          let styleOption = options.style || '';

          if (badgesFound) {
            console.log(c.green.bold('Badge found:'));
          }

          const { badgeMarkdown, htmlBadge } = utils.formatBadge(badge, styleOption, options.link ? links[index] : '');

          if (options.html) {
            // HTML
            console.log(c.hex('#FFBF00').bold(`${htmlBadge}\n`));
          } else {
            // Markdown
            console.log(c.hex('#FFBF00').bold(`${badgeMarkdown}\n`));
          }
        }
      }
    } else {
      // Looks for the badge in all categories to suggest the correct category
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

      // Suggests the correct command to run if [badgeName] is valid but [category] is not
      if (badgeFoundInOtherCategory) {
        consola.error(c.red(`The specified category could not be found, but '${c.red.bold(utils.formatBadgeName(foundBadgeName))}' is a valid badge in the '${c.red.bold(utils.formatCategoryName(correctCategory))}' category.`));
        console.log(c.cyan(`Run ${c.magenta.bold(`mdb ${correctCategory} ${foundBadgeName}`)} to get the correct badge code.\n`));
      } else {
        // If neither [category] nor [badgeName] is valid
        consola.error(c.red(`The specified badge and category could not be found.`));
        console.log(c.cyan(`Visit ${c.magenta.bold('https://github.com/inttter/mdbadges-cli?tab=readme-ov-file#categories')} for a list of available categories.`));
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

    const listLink = 'https://inttter.github.io/md-badges/';

    try {
      await open(listLink);
      spinner.succeed(c.green('Opened in your browser!'));
    } catch (error) {
      consola.error(new Error(c.red(`An error occurred when trying to open the link in your browser: ${error.message}`)));
      console.log(c.cyan(`  You can visit the page by clicking on the following link instead: ${c.magenta.bold(listLink)}`));
      spinner.stop();
    }
  });

// Search Command
program
  .command('search')
  .alias('s')
  .alias('find')
  .alias('lookup')
  .description('search for badges across any category')
  .action(async () => {
    const fuse = utils.getFuseInstance(badges);
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

      const results = utils.searchBadges(fuse, keyword);
      if (results.length === 0) {
        consola.error(c.red(`No badges containing '${keyword}' could be found.`));
      } else {
        const badgeChoices = results.map(({ item }) => ({
          name: `${c.hex('#FFBF00')(item.formattedBadge)} in ${c.dim(item.formattedCategory)}`,
          value: item.badgeCode,
        }));

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
        initial: true,
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

      await utils.checkCancellation(alt);

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

      await utils.checkCancellation(color);

      const logo = await text({
        message: c.cyan.bold('Enter the logo to be displayed on the badge:'),
        validate: (value) => {
          if (!value.trim()) {
            return c.dim('This field is required.');
          }
          return;
        },
      });

      await utils.checkCancellation(logo);

      const logoColor = await text({
        message: c.cyan.bold('Enter the color for the logo:'),
        validate: (value) => {
          if (!value.trim()) {
            return c.dim('This field is required.');
          }
          return;
        },
      });

      await utils.checkCancellation(logoColor);

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

      await utils.checkCancellation(style);

      const link = await text({
        message: c.cyan.bold('[Optional] - Enter the URL to redirect to when the badge is clicked:'),
      });

      await utils.checkCancellation(link);

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

// Random Badge Command
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
  .option('--html', 'copy HTML version of a badge')
  .description('copy a badge\'s code to the clipboard')
  .action((category, badgeName) => {

    // * This makes options work, do not remove.
    const options = program.opts();

    const formattedCategory = category.toLowerCase();
    const formattedBadgeName = badgeName.toLowerCase();

    // Check if the badge exists in the specified category
    if (badges[formattedCategory]?.[formattedBadgeName]) {
      const selectedBadge = badges[formattedCategory][formattedBadgeName];
      const { badgeMarkdown, htmlBadge } = utils.formatBadge(selectedBadge);

      if (options.html) {
        clipboardy.writeSync(htmlBadge);
        console.log(c.green.bold(`\nHTML version of badge was copied to the clipboard successfully.\n`));
      } else {
        clipboardy.writeSync(badgeMarkdown);
        console.log(c.green.bold(`\nMarkdown version of badge was copied to the clipboard successfully.\n`));
      }
    } else {
      // Handle instances in where the badge does not exist
      const validCategory = Object.keys(badges).find(cat =>
        Object.keys(badges[cat]).some(badge => badge.toLowerCase() === formattedBadgeName)
      );

      if (validCategory) {
        consola.error(c.red(`The specified category could not be found, but '${c.red.bold(utils.formatBadgeName(badgeName))}' is a valid badge in the '${c.red.bold(utils.formatCategoryName(validCategory))}' category.`));
        console.log(c.cyan(`Run ${c.magenta.bold(`mdb copy ${validCategory} ${badgeName}`)} to copy the correct badge.\n`));
      } else {
        consola.error(c.red(`The specified badge could not be found.`));
        console.log(c.cyan(`Try running ${c.magenta.bold(`mdb search`)} to directly find a badge.\n`));
      }
    }
  });

// Add Command
program
  .command('add [category] [badgeName] [filePath]')
  .option('--html', 'add HTML version of a badge to a file')
  .description('add a badge to a file')
  .action((category, badgeName, filePath) => {
    if (!filePath) {
      consola.error(c.red('No file or file path was specified.'));
      return;
    }

    // * This makes options work, do not remove.
    const options = program.opts(); 

    const formattedBadgeName = badgeName?.toLowerCase() || '';
    const categoryData = badges[category?.toLowerCase() || ''];

    if (!categoryData) {
      const validCategory = Object.keys(badges).find(cat =>
        Object.keys(badges[cat]).some(badge => badge.toLowerCase() === formattedBadgeName)
      );

      if (validCategory) {
        consola.error(c.red(`The specified category could not be found, but '${c.red.bold(utils.formatBadgeName(badgeName))}' is a valid badge in the '${c.red.bold(utils.formatCategoryName(validCategory))}' category.`));
        console.log(c.cyan(`Run ${c.magenta.bold(`mdb add ${validCategory} ${badgeName} ${filePath}`)} to add the badge to your file.\n`));
      } else {
        consola.error(c.red(`The category '${c.red.bold(category)}' could not be found.`));
        console.log(c.cyan(`You can try visiting the syntax list for the categories here: ${c.magenta.bold('https://github.com/inttter/mdbadges-cli?tab=readme-ov-file#categories')}\n`));
      }
      return;
    }

    const foundBadge = Object.keys(categoryData).find(
      key => key.toLowerCase() === formattedBadgeName,
    );

    if (!foundBadge) {
      consola.error(c.red(`The specified badge could not be found.`));
      console.log(c.cyan(`Try running ${c.magenta.bold(`mdb search`)} to directly find a badge.\n`));
      return;
    }

    const badge = categoryData[foundBadge];
    const { badgeMarkdown, htmlBadge } = utils.formatBadge(badge);

    const badgeToAdd = options.html ? htmlBadge : badgeMarkdown;

    try {
      let fileContent = ""

      // Append the badge to the specified file
      fs.appendFileSync(filePath, `\n${badgeToAdd}`, 'utf8');
      consola.success(c.green(`Badge has been added to the file successfully.`));
    } catch (error) {
      consola.error(new Error(c.red(`Could not  write to the file: ${error.message}`)));
    }
  });

// Documentation Command
program
  .command('docs')
  .description('open a link to the documentation in your browser')
  .action(async () => {
    console.log();
    const spinner = ora({
      text: c.blue('Opening the documentation in your browser...'),
      spinner: cliSpinners.arc,
      color: 'yellow',
    }).start();

    const docsLink = 'https://inttter.gitbook.io/mdbcli'

    try {
      await open(docsLink);
      spinner.succeed(c.green('Opened in your browser!'));
    } catch (error) {
      consola.error(new Error(c.red(`An error occurred when trying to open the link in your browser: ${error.message}`)));
      console.log(c.cyan(`\n  You can visit the page by clicking on the following link instead: ${c.magenta.bold(docsLink)}`));
      spinner.stop();
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
      console.log(c.cyan(`\n  You can visit the page by clicking on the following link instead: ${c.magenta.bold(changelogLink)}`));
      spinner.stop();
    }
  });

program.parse(process.argv);