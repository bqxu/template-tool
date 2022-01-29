import chalk from 'chalk'
import { run } from './src/index.js'
run()
  .then(() => {})
  .catch((reason) => {
    // console.log(`run.js`, reason)
    if (reason.message == '(outputHelp)') {
      return
    }
    console.log(chalk.red(`出错了!`))
    if (reason.command) {
      console.log(chalk.red(`运行失败： ${chalk.cyan(reason.command)} `))
    } else {
      console.log(chalk.red(reason))
    }
    console.log(chalk.red(reason.message))
    process.exit(1)
  })
