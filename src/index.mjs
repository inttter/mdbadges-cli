#!/usr/bin/env -S node --no-warnings=ExperimentalWarning

import badges from './badges.mjs';
import c from 'chalk';
import cliSpinners from 'cli-spinners';
import { consola } from 'consola';
import { confirm, select, group, text, log, outro } from '@clack/prompts';
import clipboardy from 'clipboardy';
import fs from 'fs';
import Fuse from 'fuse.js';
import open from 'open';
import ora from 'ora';
import path from 'path';
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
              linkMessage = c.cyan.bold('Enter your link here:');
            } else if (index === 0) {
              linkMessage = c.cyan.bold(`Enter the link for ${c.magenta(utils.formatBadgeName(badgeName))} here:`);
            } else {
              linkMessage = c.cyan.bold(`Enter the link for ${c.magenta(utils.formatBadgeName(badgeName))} (Badge ${index + 1}) here:`);
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
          console.log(`Try running ${c.magenta.bold('mdb search')} to look for a badge.\n`);
          
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
              message: c.cyan.bold('Did you mean one of these badges instead?'),
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
                outro(`${htmlBadge}`);
              } else {
                outro(`${badgeMarkdown}`);
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
            console.log(`${htmlBadge}\n`);
          } else {
            // Markdown
            console.log(`${badgeMarkdown}\n`);
          }
        }
      }
    } else {
      consola.error(c.red('The specified badge or category could not be found. '));
      console.log(
        `Check the available categories: ${c.magenta('https://github.com/inttter/mdbadges-cli#categories')}\n` +
        `Or directly search badges with: ${c.magenta('mdb search')}\n\n` +
        `Looking for commands? See here: ${c.magenta('https://github.com/inttter/mdbadges-cli#commands')}`
      );
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
        log.error(c.red(`No badges containing '${keyword}' could be found.`));
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

        outro(selectedBadge);
      }

      continueSearch = await confirm({
        message: c.cyan.bold('Would you like to search for another badge?'),
        initial: true,
      });

      await utils.checkCancellation(continueSearch);
    }
  });

// Badge Creation Command 
program
  .command('create')
  .alias('generate')
  .description('display prompts to create your own badge')
  .action(async () => {
    try {
      const responses = await group(
        {
          alt: () =>
            text({
              message: c.cyan.bold('Enter the alt text for the badge:'),
            }),

          name: () =>
            text({
              message: c.cyan.bold('Enter the text you would like to display on the badge:'),
              validate: (value) => {
                if (!value.trim()) return c.dim('This field is required.');
              },
            }),

          color: () =>
            text({
              message: c.cyan.bold('Enter a hexadecimal value for the color of the badge:'),
              validate: (value) => {
                const hexColorRegex = /^#?(?:[0-9a-fA-F]{3}){1,2}$/;
                if (!hexColorRegex.test(value.trim())) {
                  return c.dim('Enter a valid hexadecimal color. Valid ones include #d8e, #96f732');
                }
              },
            }),

          logo: () =>
            text({
              message: c.cyan.bold('Enter the logo to be displayed on the badge:'),
              validate: (value) => {
                if (!value.trim()) return c.dim('This field is required.');
              },
            }),

          logoColor: () =>
            text({
              message: c.cyan.bold('Enter the color for the logo:'),
              validate: (value) => {
                if (!value.trim()) return c.dim('This field is required.');
              },
            }),

          style: () =>
            select({
              message: c.cyan.bold('Choose the style of the badge:'),
              options: [
                { value: 'flat', label: 'Flat', hint: 'Popular' },
                { value: 'flat-square', label: 'Flat Square' },
                { value: 'plastic', label: 'Plastic' },
                { value: 'social', label: 'Social' },
                { value: 'for-the-badge', label: 'For The Badge', hint: 'Popular' },
              ],
            }),

          link: () =>
            text({
              message: c.cyan.bold('[Optional] Enter the URL to redirect to when clicked:'),
            }),
        },
        {
          onCancel: () => {
            log.error(c.yellow('Exiting because `CTRL+C` was pressed.\n'));
            process.exit(0);
          },
        }
      );

      // Escape spaces, dashes, and underscores
      let name = responses.name
        .replace(/-/g, '--')
        .replace(/\s/g, '_')
        .replace(/_/g, '__');

      const badgeLink =
        `https://img.shields.io/badge/${name}-${encodeURIComponent(responses.color)}?logo=${encodeURIComponent(responses.logo)}&style=${encodeURIComponent(responses.style)}` +
        (responses.logoColor ? `&logoColor=${encodeURIComponent(responses.logoColor)}` : '');

      const badgeMarkdown = responses.link
        ? `[![${responses.alt}](${badgeLink})](${responses.link})`
        : `[![${responses.alt}](${badgeLink})](#)`;

      const badgeHtml = responses.link
        ? `<a href="${utils.escapeHtml(responses.link)}">\n  <img src="${badgeLink}" alt="${utils.escapeHtml(responses.alt)}" />\n</a>`
        : `<img src="${badgeLink}" alt="${utils.escapeHtml(responses.alt)}" />`;

      log.success(c.green.bold('Custom badge created successfully!'));

      // Markdown
      log.info(c.green.bold('Markdown:'));
      log.message(badgeMarkdown);

      // HTML
      log.info(c.green.bold('HTML:'));
      log.message(badgeHtml + '\n');
    } catch (error) {
      consola.error(new Error(c.red(`An error occurred when trying to make the badge: ${error.message}`)));
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

    const resolvedPath = path.resolve(filePath);

    // Validate that the file (path) exists and is a regular file
    if (!fs.existsSync(resolvedPath) || !fs.lstatSync(resolvedPath).isFile()) {
      consola.error(c.red(`The path '${filePath}' is invalid or does not point to a valid file.`));
      return;
    }

    // * This makes options work, do not remove.
    const options = program.opts(); 

    const formattedBadgeName = badgeName?.toLowerCase() || '';
    const formattedCategory = category?.toLowerCase() || '';
    const categoryData = badges[formattedCategory];

    const foundBadge = categoryData?.[formattedBadgeName];

    if (!foundBadge) {
      consola.error(c.red('The specified badge or category could not be found. '));
      console.log(
        `Check the available categories: ${c.magenta('https://github.com/inttter/mdbadges-cli#categories')}\n` +
        `Or directly search badges with: ${c.magenta('mdb search')}`
      );
      return;
    }

    const { badgeMarkdown, htmlBadge } = utils.formatBadge(foundBadge);
    const badgeToAdd = options.html ? htmlBadge : badgeMarkdown;

    try {
      // Append the badge to the specified file
      fs.appendFileSync(filePath, `\n${badgeToAdd}`, 'utf8');
      console.log(c.green.bold(`\nBadge has been added to ${filePath} successfully.\n`));
    } catch (error) {
      consola.error(new Error(c.red(`Could not write to the file: ${error.message}`)));
    }
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
    const selectedBadge = badges[formattedCategory]?.[formattedBadgeName];

    if (selectedBadge) {
      const { badgeMarkdown, htmlBadge } = utils.formatBadge(selectedBadge);

      clipboardy.writeSync(options.html ? htmlBadge : badgeMarkdown);
      console.log(c.green.bold(`\n${options.html ? 'HTML' : 'Markdown'} version of badge was copied to the clipboard successfully.\n`));
    } else {
      consola.error(c.red(`The specified badge or category could not be found.`));
      console.log(
        `Check the available categories: ${c.magenta('https://github.com/inttter/mdbadges-cli#categories')}\n` +
        `Or directly search badges with: ${c.magenta('mdb search')}`
      );
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
    console.log(c.green.bold('\nMarkdown:'));
    console.log(markdownBadge + '\n');

    console.log(c.green.bold('HTML:'));
    console.log(htmlBadge + '\n');
  });

// Badge List Command
program
  .command('badges')
  .alias('list')
  .description('open a link to the badge list in your browser')
  .action(async () => {
    console.log();
    const spinner = ora({
      text: c.blue('Opening in browser...'),
      spinner: cliSpinners.arc,
      color: 'magenta',
    }).start();

    const listLink = 'https://inttter.github.io/md-badges/';

    try {
      await open(listLink);
      spinner.succeed(c.green.bold('Opened in your browser!'));
    } catch (error) {
      consola.error(new Error(c.red(`An error occurred when trying to open the link in your browser: ${error.message}`)));
      console.log(`    Follow the link here instead: ${c.magenta.bold(listLink)}`);
      spinner.stop();
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
      spinner.succeed(c.green.bold('Opened in your browser!'));
    } catch (error) {
      consola.error(new Error(c.red(`An error occurred when trying to open the link in your browser: ${error.message}`)));
      console.log(`\n    Follow the link here instead: ${c.magenta.bold(docsLink)}`);
      spinner.stop();
    }
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
      spinner.succeed(c.green.bold('Opened in your browser!'));
    } catch (error) {
      consola.error(new Error(c.red(`Could not open the link in your browser: ${error.message}`)));
      console.log(`\n    Follow the link here instead: ${c.magenta.bold(changelogLink)}`);
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

program.parse(process.argv);
