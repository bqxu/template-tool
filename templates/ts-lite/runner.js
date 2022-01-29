import path from 'path'
import url from 'url'
import fs, { mkdirSync } from 'fs'
import chalk from 'chalk'

import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const config = require('./package.json')

import { info, log, lsDirFR, success, prompts } from '../../src/index.js'

const __file_name = () => {
  return url.fileURLToPath(import.meta.url)
}

const __dir_name = () => {
  return path.dirname(__file_name())
}

const out_help = async () => {
  log(`Usage: new ts-lite -d <dir>`)
  log(``)
  log(`生成 ts-lite 页面`)
  log(``)
  log(`Options:`)
  log(`  -d, --dir <dir>  目录 (default: "./")`)
  log(``)
}

const matchPattern = async (patterns, rel_path) => {
  if (patterns.includes('*')) {
    return true
  }
  return Promise.any(
    patterns.map(
      (p) =>
        new Promise((resolve, reject) => {
          if (rel_path.indexOf(p) > -1) {
            resolve(true)
            return
          }
          resolve(false)
        }),
    ),
  )
}

const Runner = async (workspace, options) => {
  if (options._.includes('help')) {
    out_help()
    return
  }

  let pattern = ['*']

  if (options.sub) {
    if (!config.commmand[options.sub]) {
      throw new RunCommanderError(`为匹配到有效的 --sub ${options.sub}`)
    }
    pattern = config.commmand[options.sub]
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

  if (config.template == 'none') {
    let files = lsDirFR(path.join(__dir_name(), 'tpl/'))
    for (let i = 0; i < files.length; i++) {
      let file = files[i]

      if (!(await matchPattern(pattern, file.relPath))) {
        continue
      }

      let relPath = file.relPath
      relPath = relPath.replace(/\[(\w+)\]/g, function (str, rep_str) {
        return data[`file_${rep_str}`] || data[rep_str] || rep_str
      })
      if (fs.existsSync(path.join(workspace, relPath))) {
        if (!options.force) {
          info(
            `已跳过已存在的文件，若继续执行，请使用 ${chalk.yellow(`--force`)} 在继续 : ${path.join(
              workspace,
              relPath,
            )}`,
          )
          continue
        }
      }
      mkdirSync(path.dirname(path.join(workspace, relPath)), { recursive: true })
      fs.copyFileSync(file.path, path.join(workspace, relPath))
    }
  }

  success('执行成功！')
}

export default Runner
