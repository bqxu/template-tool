import path from 'path'
import fs, { mkdirSync } from 'fs'
import chalk from 'chalk'
import prompts from 'prompts'
import { cwd, success, lsDirNotEmpity, info, log } from '../tool.js'
import {
  find_buildIn_templates,
  find_buildin_template_file,
  find_global_templates,
  find_global_template_file,
  find_local_template_file,
  global_templates,
} from './common.js'
import { RunCommanderError } from '../error.js'
import { execa } from 'execa'
import { config } from 'process'

export const Template_Config_Command = async (templateName, options, command) => {
  let tpl = await find_global_templates(templateName)
  if (tpl) {
    tpl.global = true
  }
  if (!tpl) {
    tpl = await find_buildIn_templates(templateName)
  }
  if (!tpl) {
    info(`未找到可配置的模版：${templateName}
    说明：仅内建模版和全局模版支持模版配置操作`)
    return
  }

  let def_config_file = path.join(tpl.path, 'config.json')
  if (!fs.existsSync(def_config_file)) {
    info(`当前模版不支持配置，未找到配置文件：${def_config_file}`)
    return
  }

  options.tpl = tpl

  if (options.list) {
    Template_Config_List(templateName, options)
    return
  }
  if (options.edit) {
    Template_Config_Edit(templateName, options)
    return
  }

  if (options.remove) {
    Template_Config_Remove(templateName, options)
  }
}

/**
 * 列出模版配置
 * @param {*} templateName
 */
export const Template_Config_List = async (templateName, options) => {
  const tpl = options.tpl
  let def_config_file = path.join(tpl.path, 'config.json')
  info(`已找到配置：`)
  log(`${chalk.cyan('默认配置')}： ${def_config_file}`)

  let active = '默认配置'

  let global_config_file = await find_global_template_file(templateName, 'config.json')
  if (fs.existsSync(global_config_file)) {
    log(`${chalk.cyan('全局配置')}： ${global_config_file}`)

    active = '全局配置'
  }

  let local_config_file = await find_local_template_file(templateName, options.dir, 'config.json')
  if (local_config_file != global_config_file && fs.existsSync(local_config_file)) {
    log(`${chalk.cyan('本地配置')}： ${local_config_file}`)
    active = '本地配置'
  }

  log(`当前生效配置： ${chalk.cyan(active)}`)
}

/**
 * 编辑模版配置
 * @param {*} templateName
 */
export const Template_Config_Edit = async (templateName, options) => {
  const tpl = options.tpl
  let def_config_file = path.join(tpl.path, 'config.json')

  if (options.global) {
    let global_config_file = await find_global_template_file(templateName, 'config.json')
    if (fs.existsSync(global_config_file)) {
      info(`${chalk.cyan('配置已存在')}： ${global_config_file}`)
      return
    } else {
      mkdirSync(path.dirname(global_config_file), { recursive: true })
      fs.copyFileSync(def_config_file, global_config_file)
      info(`${chalk.cyan('配置已生成')}： ${global_config_file}`)
      return
    }
  }

  let local_config_file = await find_local_template_file(templateName, options.dir, 'config.json')

  if (fs.existsSync(local_config_file)) {
    info(`${chalk.cyan('配置已存在')}： ${local_config_file}`)
    return
  } else {
    mkdirSync(path.dirname(local_config_file), { recursive: true })
    fs.copyFileSync(def_config_file, local_config_file)
    info(`${chalk.cyan('配置已生成')}： ${local_config_file}`)
    return
  }
}

/**
 * 删除模版配置
 * @param {*} templateName
 */
export const Template_Config_Remove = async (templateName, options) => {
  if (options.global) {
    let global_config_file = await find_global_template_file(templateName, 'config.json')
    if (!fs.existsSync(global_config_file)) {
      info(`${chalk.cyan('配置不存在')}： ${global_config_file}`)
      return
    } else {
      const response = await prompts({
        type: 'toggle',
        name: 'value',
        message: '删除要全局配置么?',
        initial: true,
        active: 'yes',
        inactive: 'no',
      })

      if (!response.value) {
        return
      }
      fs.rmSync(global_config_file)
      info(`${chalk.cyan('配置已删除')}： ${global_config_file}`)
      return
    }
  }

  let local_config_file = await find_local_template_file(templateName, options.dir, 'config.json')

  if (!fs.existsSync(local_config_file)) {
    info(`${chalk.cyan('配置不存在')}： ${local_config_file}`)
    return
  } else {
    const response = await prompts({
      type: 'toggle',
      name: 'value',
      message: '删除要本地配置么?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    })

    if (!response.value) {
      return
    }
    fs.rmSync(local_config_file)
    info(`${chalk.cyan('配置已删除')}： ${local_config_file}`)
    return
  }
}
