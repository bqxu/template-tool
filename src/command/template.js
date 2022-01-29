import { Command } from 'commander'
import { TemplateNewCommand } from './template/new.js'
import { TemplateRmCommand } from './template/rm.js'

/**
 * 命令：模版管理
 */
export const TemplateCommand = () => {
  const command = new Command('template')
  command.addCommand(TemplateNewCommand()).addCommand(TemplateRmCommand()).description('模版管理')
  return command
}
