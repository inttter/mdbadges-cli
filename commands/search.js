const inquirer = require("inquirer");
const chalk = require("chalk");
const gradient = require("gradient-string");

function formatCategoryName(category) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

async function searchCommand(badges) {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "category",
      message: gradient.cristal("Enter the category name:"),
      validate: (input) => {
        if (input.trim() === "") {
          return "Please enter a category name.";
        }
        return true;
      },
    },
  ]);

  const formattedCategory = formatCategoryName(answer.category);
  const categoryData = badges[formattedCategory];

  if (categoryData) {
    console.log();
    console.log(gradient.cristal(`Badges available:`));
    console.log();
    Object.keys(categoryData).forEach((badge) => {
      console.log(gradient.cristal(`• ${badge}`));
    });
    console.log(
      chalk.hex("#289FF9")(
        `\nTo get the code ${gradient.cristal("Markdown")} version of a badge, type 'mdb ${formattedCategory} <badgeName>'.`,
      ),
    );
    console.log(
      chalk.hex("#289FF9")(
        `If you want the ${gradient.cristal("HTML")} version of a badge, type 'mdb --html ${formattedCategory} <badgeName>'.`,
      ),
    );
    console.log();
  } else {
    console.log(
      chalk.hex("#FF0000")(`Category "${answer.category}" could not be found.`),
    );
    console.log();
  }
}

module.exports = { searchCommand, formatCategoryName };
