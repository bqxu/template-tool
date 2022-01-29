import path from 'path'
import chalk from 'chalk'
import fs, { mkdirSync } from 'fs'
import { execa } from 'execa'
import { global_dir, cwd, config_dir_name, info, success, log } from '../tool.js'
import { RunCommanderError } from '../error.js'

export const Fetch_Git_Command = async (url, options, command) => {
  let remote_url = url
  let clone_args = []
  clone_args.push('clone')
  const { force } = options
  if (options.branch) {
    clone_args.push('-b')
    clone_args.push(options.branch)
  } else if (options.tag) {
    clone_args.push('-b')
    clone_args.push(options.tag)
  }
  clone_args.push(remote_url)

  let local_template = path.join(global_dir(), 'templates')

  if (options.dir) {
    local_template = path.join(cwd(), options.dir, config_dir_name, 'templates')
  }

  let name = options.name

  if (!name) {
    name = path.basename(remote_url, '.git')
  }

  let local_dir = path.join(local_template, name)

  clone_args.push(local_dir)

  if (fs.existsSync(local_dir)) {
    if (!force) {
      success(`文件夹不为空，若继续执行，请使用 ${chalk.yellow(`--force`)} 在继续 : ${local_dir}`)
      return
    }
    success(`正在删除： ${local_dir}`)
    fs.rmSync(local_dir, {
      recursive: true,
      force: true,
    })
  }

  mkdirSync(local_template, { recursive: true })

  try {
    log(`开始clone...`)
    await execa('git', clone_args, {
      cwd: cwd(),
      stdio: ['ignore', 'inherit', 'inherit'],
    })
  } catch (e) {
    console.log(e)
    throw new RunCommanderError(`clone git 失败`)
  }

  try {
    await execa('npm', ['install'], {
      cwd: local_dir,
      stdio: ['ignore', 'inherit', 'inherit'],
    })
  } catch (e) {
    throw new RunCommanderError(`npm install 失败`)
  }
  success(`拉取模版执行成功： ${name}:${local_dir}`)
}
