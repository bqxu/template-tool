import path from 'path'
import fs, { mkdirSync } from 'fs'
import chalk from 'chalk'
import prompts from 'prompts'
import { cwd, success, lsDirNotEmpity, info } from '../tool.js'
import { find_buildIn_templates } from './common.js'
import { RunCommanderError } from '../error.js'
import { execa } from 'execa'

export const template_new_command = async (templateName, options, command) => {
  let template = options.template
  let force = options.force
  let dir = path.join(cwd(), templateName)

  if (options.dir) {
    dir = path.join(cwd(), options.dir)
  }

  let tpl = await find_buildIn_templates(template || 'new')

  if (!tpl) {
    throw new RunCommanderError(command.name(), `未找到内置模模版: ${template}`)
  }

  if (options.force) {
    const response = await prompts({
      type: 'toggle',
      name: 'value',
      message: '正在使用 --force ,会进行覆盖操作，确定么?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    })

    if (!response.value) {
      return
    }
  }

  if (lsDirNotEmpity(dir)) {
    if (!force) {
      info(`文件夹不为空，若继续执行，请使用 ${chalk.yellow(`--force`)}在继续 : ${dir}`)
      return
    }
  }

  await exec_template_new(tpl, dir)

  success(`新模版，已创建成功: ${dir}`)
}

export const exec_template_new = async (tpl, workspace) => {
  mkdirSync(workspace, { recursive: true })
  fs.cpSync(tpl.path, workspace, { recursive: true })

  try {
    await execa('npm', ['install'], {
      cwd: workspace,
      stdio: ['ignore', 'inherit', 'inherit'],
    })
  } catch (e) {
    throw new RunCommanderError(`npm install 失败`)
  }
}
