import path from 'path'
import { build_options, cwd, exec_file } from '../tool.js'
import { RunCommanderError } from '../error.js'
import { find_local_templates, find_global_templates, find_buildIn_templates } from './common.js'

export const run_command = async (templateName, options, command) => {
  let dir = options.dir
  dir = path.join(cwd(), dir)
  let tpl = await find_local_templates(templateName, dir)
  if (!tpl) {
    tpl = await find_global_templates(templateName)
  }
  if (!tpl) {
    tpl = await find_buildIn_templates(templateName)
  }

  if (!tpl) {
    throw new RunCommanderError(command.name(), `未找到模版: ${templateName}`)
  }

  const args = {
    ...options,
    ...build_options(command.args.slice(1)),
  }
  await exec_template(tpl, dir, args)
}

export const exec_template = async (template, dir, options) => {
  let runner = await exec_file(path.join(template.path, './runner.js'))

  if (typeof runner !== 'function') {
    throw new RunCommanderError(`未找到runner： ${template.path}`)
  }
  runner(dir, options)
}
