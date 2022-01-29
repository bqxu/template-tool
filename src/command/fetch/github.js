import chalk from 'chalk'
import { Command } from 'commander'
import { info } from '../../tool.js'

/**
 * 命令：新建模版
 */
export const FetchGithubCommand = () => {
  return new Command('github')
    .argument('[url]', '仓库地址')
    .option('-b,--branch', '分支')
    .option('-t,--tag', 'tag')
    .option('-n, --name <name>', '本地模版名称')
    .option('-f, --force <force>', '覆盖', false)
    .description('从git仓库拉取模版')
    .showHelpAfterError()
    .action(() => {
      info(`请先使用 ${chalk.cyan(`gen-code fetch git`)} , github 定制待实现`)
    })
}
