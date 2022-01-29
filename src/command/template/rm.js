import { Command } from 'commander'
import { Template_Rm_Command } from '../../exec/template_rm.js'

/**
 * 命令：新建模版
 */
export const TemplateRmCommand = () => {
  return new Command('rm')
    .argument('<template>', '新模版名称')
    .option('-d, --dir <dir>', '目录', './')
    .option('-f, --force <force>', '覆盖', false)
    .description('删除模版')
    .showHelpAfterError()
    .action(Template_Rm_Command)
}
