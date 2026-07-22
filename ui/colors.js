const chalk = require("chalk");

module.exports = {
  success: (text) => console.log(chalk.green(text)),

  error: (text) => console.log(chalk.red(text)),

  warning: (text) => console.log(chalk.yellow(text)),

  info: (text) => console.log(chalk.cyan(text)),

  heading: (text) => console.log(chalk.blue.bold(text)),

  divider: () => console.log(chalk.gray("--------------------------------------")),

  normal: (text) => console.log(text),
};
