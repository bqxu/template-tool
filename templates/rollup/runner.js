import path from 'path'
import url from 'url'
import chalk from 'chalk'
import fs, { mkdirSync } from 'fs'

import { createRequire } from 'module'

import {
  lsDirFR,
  pug_compile,
  camelCase,
  CamelCase,
  prompts,
  info,
  RunCommanderError,
  log,
  success,
} from '../../src/index.js'

const require = createRequire(import.meta.url)

const config = require('./package.json')

const __file_name = () => {
  return url.fileURLToPath(import.meta.url)
}

const __dir_name = () => {
  return path.dirname(__file_name())
}

const out_help = async () => {
  log(`Usage: new new -d <dir> `)
  log(``)
  log(`生成 new 内页面模版`)
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

const mergePackageJson = async (workspace) => {
  let pkg_this = path.join(__dir_name(), 'tpl/package.json')
  let pkg_wk = path.join(workspace, 'package.json')
  if (!fs.existsSync(pkg_wk)) {
    fs.copyFileSync(pkg_this, pkg_wk)
  } else {
    let pkg_json_wk = JSON.parse(fs.readFileSync(pkg_wk))
    let pkg_json_tpl = JSON.parse(fs.readFileSync(pkg_this))

    for (let key in pkg_json_tpl.scripts) {
      if (!pkg_json_wk.scripts) {
        pkg_json_wk.scripts = {}
      }
      if (pkg_json_wk.scripts[key]) {
        pkg_json_wk.scripts[key + ':rollup'] = pkg_json_tpl.scripts[key]
      } else {
        pkg_json_wk.scripts[key] = pkg_json_tpl.scripts[key]
      }
    }

    for (let key in pkg_json_tpl.devDependencies) {
      if (!pkg_json_wk.devDependencies) {
        pkg_json_wk.devDependencies = {}
      }
      if (pkg_json_wk.devDependencies[key]) {
        pkg_json_wk.devDependencies[key + ':rollup'] = pkg_json_tpl.devDependencies[key]
      } else {
        pkg_json_wk.devDependencies[key] = pkg_json_tpl.devDependencies[key]
      }
    }
  }
}

const Runner = async (workspace, options) => {
  if (options._.includes('help')) {
    out_help()
    return
  }

  let pattern = config.commmand['default'] || ['*']

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

  if (config.template == 'pug') {
    mkdirSync(workspace, { recursive: true })

    let files = lsDirFR(path.join(__dir_name(), 'tpl/'))
    for (let i = 0; i < files.length; i++) {
      let file = files[i]

      if (!(await matchPattern(pattern, file.relPath))) {
        continue
      }

      const data = {}

      if (file.path.endsWith('.pug')) {
        let relPath = file.relPath
        relPath = relPath.substring(0, relPath.length - 4)
        relPath = relPath.replace(/\[(\w+)\]/g, function (str, rep_str) {
          return data[rep_str] || rep_str
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

        let fileStr = pug_compile(file.path, data)

        mkdirSync(path.dirname(path.join(workspace, relPath)), { recursive: true })
        fs.writeFileSync(path.join(workspace, relPath), fileStr, { encoding: 'utf-8' })
      } else {
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
  }

  await mergePackageJson(workspace)
  success('执行成功！')
}

export default Runner
