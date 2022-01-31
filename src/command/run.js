import { Command } from 'commander'
import chalk from 'chalk'
import { run_command } from '../exec/run.js'

/**
 * 命令：运行
 */
export const RunCommand = () => {
  const command = new Command('run')
  command
    .argument('<template>', '模版名称')
    .option('-d, --dir <dir>', '目录', './')
    .option('-tp, --template-path <templatePath>', '模版路径')
    .option('-cp, --config-path <configPath>', '本地配置路径')
    .allowUnknownOption(true)
    .allowExcessArguments(true)
    .description('运行模版')
    .showHelpAfterError()
    .addHelpText(
      `after`,
      `
查看全部模版，请使用 ${chalk.cyan('ls')} 命令
`,
    )
    .action(run_command)
  return command
}
