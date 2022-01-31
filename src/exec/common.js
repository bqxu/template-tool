import path from 'path'
import { lsDirD, bin_dir, project_dir, global_dir, cwd, config_dir_name } from '../tool.js'

/**
 *
 * @returns 全部内建模版
 */
export const buildIn_templates = async () => {
  const buildIn_template_path = path.join(bin_dir(), 'templates')
  return lsDirD(buildIn_template_path)
}

/**
 *
 * @param templateName
 * @returns 查找内建模版
 */
export const find_buildIn_templates = async (templateName) => {
  const in_tpls = await buildIn_templates()
  return in_tpls.find((tpl) => {
    return tpl.name === templateName
  })
}

/**
 *
 * @returns 全部本地模版
 */
export const local_templates = async (dir) => {
  let pro_dir = project_dir()
  if (dir) {
    pro_dir = path.resolve(pro_dir, dir)
  }
  if (!pro_dir) {
    return []
  }
  const local_template_path = path.join(pro_dir, config_dir_name, 'templates')
  return lsDirD(local_template_path)
}

/**
 *
 * @param templateName
 * @param dir
 * @returns 查找本地模版
 */
export const find_local_templates = async (templateName, dir) => {
  const local_tpls = await local_templates(dir)
  return local_tpls.find((tpl) => {
    return tpl.name === templateName
  })
}

/**
 *
 * @returns 列出全局模版
 */
export const global_templates = async () => {
  const tpl_dir = path.join(global_dir(), 'templates')
  // console.log(`global_dir`, tpl_dir)
  return lsDirD(tpl_dir)
}

/**
 *
 * @param templateName
 * @returns 查找全局模版
 */
export const find_global_templates = async (templateName) => {
  const in_tpls = await global_templates()
  return in_tpls.find((tpl) => {
    return tpl.name === templateName
  })
}

/**
 * 查找内建模版内文件
 * @param {*} templateName
 * @param {*} fileName
 * @returns
 */
export const find_buildin_template_file = async (templateName, fileName) => {
  return path.join(bin_dir(), 'templates', templateName, fileName)
}

/**
 * 查找模版全局自定义文件
 * @param {*} templateName
 * @returns
 */
export const find_global_template_file = async (templateName, fileName) => {
  return path.join(global_dir(), 'custom', templateName, fileName)
}

/**
 * 查找模版本地自定义文件
 * @param {*} templateName
 * @param {*} dir
 * @returns
 */
export const find_local_template_file = async (templateName, dir, fileName) => {
  let pro_dir = project_dir()
  if (!dir) {
    return path.resolve(pro_dir, 'custom', templateName, fileName)
  }
  if (dir) {
    pro_dir = path.resolve(cwd(), dir, '.gen-code')
  }
  return path.join(pro_dir, 'custom', templateName, fileName)
}
