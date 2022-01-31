import { Command } from 'commander'
import { Template_Config_Command } from '../../exec/template_config.js'

/**
 * 命令：拉取远超模版
 */
export const TemplateConfigCommand = () => {
  const command = new Command('config')
    .argument('<template>', '新模版名称')
    .option('-l,--list', '列出配置')
    .option('-e,--edit', '编辑配置')
    .option('-r,--remove', '删除配置')
    .option('-g,--global', '全局配置')
    .option('-d,--dir <dir>', '目录')
    .showHelpAfterError()
    .description('模版配置')
    .action(Template_Config_Command)

  return command
}
