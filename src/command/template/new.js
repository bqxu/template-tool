import { Command } from 'commander'
import { template_new_command } from '../../exec/template_new.js'

/**
 * 命令：新建模版
 */
export const TemplateNewCommand = () => {
  return new Command('new')
    .argument('<template>', '新模版名称')
    .option('-d, --dir <dir>', '目录')
    .option('-t, --template <template>', '模版', 'new')
    .option('-f, --force', '覆盖', false)
    .description('新建模版')
    .showHelpAfterError()
    .action(template_new_command)
}
