import { cwd, success, info, log } from '../tool.js'
import path from 'path'
import { buildIn_templates, global_templates, local_templates } from './common.js'
import chalk from 'chalk'

export const ls_command = async (options, command) => {
  let dir = options.dir
  dir = path.resolve(cwd(), dir)
  let local_tpls = await local_templates(dir)
  let global_tpls = await global_templates()
  let buildIn_tpls = await buildIn_templates()

  if (local_tpls.length) {
    info(`本地模版:`)
    local_tpls.forEach((tpl) => {
      log(`    ${chalk.cyan(tpl.name)}: ${tpl.path}`)
    })
  }
  if (global_tpls.length) {
    info(`全局模版:`)
    global_tpls.forEach((tpl) => {
      log(`    ${chalk.cyan(tpl.name)}: ${tpl.path}`)
    })
  }
  if (buildIn_tpls.length) {
    info(`内建模版:`)
    buildIn_tpls.forEach((tpl) => {
      log(`    ${chalk.cyan(tpl.name)}: ${tpl.path}`)
    })
  }
}
