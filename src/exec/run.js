import path from 'path'
import fs from 'fs'
import { build_options, cwd, exec_file, info } from '../tool.js'
import { RunCommanderError } from '../error.js'
import {
  find_local_templates,
  find_global_templates,
  find_buildIn_templates,
  find_global_template_file,
  find_local_template_file,
} from './common.js'

import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export const run_command = async (templateName, options, command) => {
  let dir = options.dir
  dir = path.resolve(cwd(), dir)

  let tpl = null
  if (options.templatePath) {
    tpl = {
      name: templateName,
      path: path.resolve(cwd(), options.templatePath),
    }
  } else {
    await find_local_templates(templateName, dir)
    if (!tpl) {
      tpl = await find_global_templates(templateName)
    }
    if (!tpl) {
      tpl = await find_buildIn_templates(templateName)
    }
  }
  if (!tpl) {
    throw new RunCommanderError(command.name(), `未找到模版: ${templateName}`)
  }

  const args = {
    ...options,
    ...build_options(command.args.slice(1)),
    config: await read_template_config(tpl, templateName, options),
  }
  await exec_template(tpl, dir, args)
}

export const read_template_config = async (template, templateName, options) => {
  let def_config_file = path.join(template.path, 'config.json')
  if (!fs.existsSync(def_config_file)) {
    return {}
  }
  let global_config_file = await find_global_template_file(templateName, 'config.json')

  let local_config_file = await find_local_template_file(templateName, options.configPath, 'config.json')

  console.log(local_config_file)

  if (fs.existsSync(local_config_file)) {
    try {
      info(`使用本地配置：${local_config_file}`)
      return require(local_config_file)
    } catch {
      throw new RunCommanderError(`本地配置文件错误：${local_config_file}`)
    }
  }

  if (fs.existsSync(global_config_file)) {
    try {
      info(`使用全局配置：${def_config_file}`)
      return require(global_config_file)
    } catch (e) {
      console.log(e)
      throw new RunCommanderError(`全局配置文件错误：${global_config_file}`)
    }
  }

  try {
    info(`使用默认配置：${def_config_file}`)
    return require(def_config_file)
  } catch {
    throw new RunCommanderError(`默认配置文件错误：${def_config_file}`)
  }
}

export const exec_template = async (template, dir, options) => {
  let runner = await exec_file(path.join(template.path, './runner.js'))

  if (typeof runner !== 'function') {
    throw new RunCommanderError(`未找到runner： ${template.path}`)
  }

  await runner(dir, options)
}
