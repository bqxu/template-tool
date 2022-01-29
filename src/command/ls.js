import { Command } from 'commander'

import { ls_command } from '../exec/ls.js'
/**
 * 命令：列出本地模版
 */
export const LsCommand = () => {
  return new Command('ls').option('-d, --dir <dir>', '目录', './').description('列出本地模版').action(ls_command)
}
