import path from 'path'
import fs, { mkdirSync } from 'fs'
import chalk from 'chalk'
import { execa } from 'execa'
import { global_dir, cwd, user_tmp, success, log, config_dir_name } from '../tool.js'

export const Fetch_Npm_Command = async (pkg, options, command) => {
  let local_template = path.join(global_dir(), 'templates')

  const force = options.force

  if (options.dir) {
    local_template = path.resolve(cwd(), options.dir, config_dir_name, 'templates')
  }

  let name = options.name

  if (!name) {
    name = pkg
  }

  let pkgName = pkg
  if (options.version) {
    pkgName = `${pkg}@${options.version}`
  }

  let local_dir = path.join(local_template, name)

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

  let tmp_dir = user_tmp()

  try {
    log(`开始install...`)
    let { exitCode } = await execa('npm', ['install', pkgName], {
      cwd: tmp_dir,
      stdio: ['ignore', 'inherit', 'inherit'],
    })

    if (exitCode) {
      return
    }
  } catch (e) {
    console.log(e)
    throw new RunCommanderError(`npm install 失败`)
  }

  fs.cpSync(path.join(tmp_dir, 'node_modules', pkg), local_dir, {
    recursive: true,
  })

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
