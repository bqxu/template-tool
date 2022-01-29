import path from 'path'
import fs, { mkdirSync } from 'fs'
import chalk from 'chalk'
import { cwd, success, lsDirNotEmpity } from '../tool.js'
import { find_buildIn_templates } from './common.js'
import { RunCommanderError } from '../error.js'

export const template_new_command = async (templateName, options, command) => {
  let dir = options.dir
  let template = options.template
  let force = options.force
  dir = path.join(cwd(), dir)

  let tpl = await find_buildIn_templates(template || 'new')

  if (!tpl) {
    throw new RunCommanderError(command.name(), `未找到内置模模版: new`)
  }

  if (lsDirNotEmpity(dir)) {
    if (!force) {
      success(`文件夹不为空，若继续执行，请使用 ${chalk.yellow(`--force`)}在继续 : ${options.dir}`)
      return
    }
  }

  await exec_template_new(tpl, dir)

  success(`新模版，已创建成功: ${options.dir}`)
}

export const exec_template_new = async (tpl, workspace) => {
  mkdirSync(workspace, { recursive: true })
  fs.cpSync(tpl.path, workspace, { recursive: true })
}
