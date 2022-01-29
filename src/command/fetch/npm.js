import { Command } from 'commander'
import { Fetch_Npm_Command } from '../../exec/fetch_npm.js'

/**
 * 命令：新建模版
 */
export const FetchNpmCommand = () => {
  return new Command('npm')
    .argument('<pkg>', '包名')
    .option('-t,--tag <version>', '版本号')
    .option('-n, --name <name>', '模版名称')
    .option('-f, --force', '覆盖', false)
    .description('从npm仓库拉取模版')
    .showHelpAfterError()
    .action(Fetch_Npm_Command)
}
