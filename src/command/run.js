import { Command } from 'commander'
import { run_command } from '../exec/run.js'

/**
 * 命令：运行
 */
export const RunCommand = () => {
  const command = new Command('run')
  command
    .argument('[template]', '模版名称', 'ts-lite')
    .option('-d, --dir <dir>', '目录', './')
    .allowUnknownOption(true)
    .allowExcessArguments(true)
    .description('运行模版')
    .showHelpAfterError()
    .action(run_command)
  return command
}
