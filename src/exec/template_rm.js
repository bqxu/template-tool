import path from 'path'
import fs from 'fs'
import { info, cwd, success, log } from '../tool.js'
import { find_buildIn_templates, find_global_templates, find_local_templates } from './common.js'

import { ls_command } from './ls.js'

export const Template_Rm_Command = async (templateName, options, command) => {
  const force = options.force
  let dir = options.dir

  dir = path.join(cwd(), dir)

  let tpl = await find_local_templates(templateName, dir)

  if (!tpl) {
    tpl = await find_global_templates(templateName)
  }
  if (!tpl) {
    tpl = await find_buildIn_templates(templateName)
    if (tpl) {
      info(`内建模版，不支持删除！ :${templateName}`)
      return
    }
  }

  if (!tpl) {
    info(`未查找模版 :${templateName}`)
    return
  }

  fs.rmSync(tpl.path, {
    recursive: true,
  })

  success(`删除成功! ${templateName}:${tpl.path}`)

  success(``)

  log(`检查模版。。。。。`)

  ls_command(options)
}
