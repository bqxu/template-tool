import { Command } from 'commander'
import { Fetch_Git_Command } from '../../exec/fetch_git.js'

/**
 * 命令：新建模版
 */
export const FetchGitCommand = () => {
  return new Command('git')
    .argument('<url>', '仓库地址')
    .option('-b,--branch <branch>', '分支')
    .option('-t,--tag <tag>', 'tag')
    .option('-n, --name <name>', '本地模版名称')
    .option('-f, --force', '覆盖', false)
    .option('-d, --dir [dir]', '本地目录')
    .description('从git仓库拉取模版')
    .showHelpAfterError()
    .action(Fetch_Git_Command)
}
