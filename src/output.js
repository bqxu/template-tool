import chalk from 'chalk'

/**
 * 配置输出
 */
export const configureOutput = (program) => {
  program.configureOutput({
    // Visibly override write routines as example!
    writeOut: (str) => process.stdout.write(chalk.white(str)),
    writeErr: (str) => process.stdout.write(chalk.red(str)),
    // Highlight errors in color.
    outputError: (str, write) => write(chalk.red(str)),
  })
}
