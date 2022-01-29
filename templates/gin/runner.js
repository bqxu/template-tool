import path from 'path'
import url from 'url'
import fs, { mkdirSync } from 'fs'

import { createRequire } from 'module'

import { lsDirFR, pug_compile, underScoreCase, CamelCase, RunCommanderError, success, chalk } from '../../src/index.js'

const require = createRequire(import.meta.url)

const config = require('./package.json')

const __file_name = () => {
  return url.fileURLToPath(import.meta.url)
}

const __dir_name = () => {
  return path.dirname(__file_name())
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

const page_name = (app, table, option) => {
  if (!app) {
    return `${table}_${option}`
  }
  return `${app}.${table}_${option}`
}

const Runner = async (workspace, options) => {
  if (!options.model) {
    throw new RunCommanderError('请设置参数 --model')
  }

  const db = options.db || ''
  let table_name = options.table || options.model
  let db_table_name = table_name
  if (db) {
    db_table_name = `${db}.${table_name}`
  }

  let pattern = ['*']

  if (options.sub) {
    if (!config.commmand[options.sub]) {
      throw new RunCommanderError(`为匹配到有效的 --sub ${options.sub}`)
    }
    pattern = config.commmand[options.sub]
  }

  if (config.template == 'pug') {
    mkdirSync(workspace, { recursive: true })

    let files = lsDirFR(path.join(__dir_name(), 'tpl/'))
    for (let i = 0; i < files.length; i++) {
      let file = files[i]

      if (!(await matchPattern(pattern, file.relPath))) {
        continue
      }

      const data = {
        ...options,
        db,
        table_name: db_table_name,
        Model: CamelCase(options.model),
        Router: CamelCase(options.model),
        file_model: underScoreCase(options.model),
      }
      if (file.path.endsWith('.pug')) {
        let relPath = file.relPath
        relPath = relPath.substring(0, relPath.length - 4)
        let fileStr = pug_compile(file.path, data)
        relPath = relPath.replace(/\[(\w+)\]/g, function (str, rep_str) {
          return data[`file_${rep_str}`] || data[rep_str] || rep_str
        })
        if (fs.existsSync(path.join(workspace, relPath))) {
          if (!options.force) {
            success(`已跳过已存在的文件，若继续执行，请使用 ${chalk.yellow(`--force`)} 在继续 : ${relPath}`)
          }
          continue
        }
        mkdirSync(path.dirname(path.join(workspace, relPath)), { recursive: true })
        fs.writeFileSync(path.join(workspace, relPath), fileStr, { encoding: 'utf-8' })
      } else {
        let relPath = file.relPath
        relPath = relPath.replace(/\[(\w+)\]/g, function (str, rep_str) {
          console.log(rep_str)
          return data[`file_${rep_str}`] || data[rep_str] || rep_str
        })
        if (fs.existsSync(path.join(workspace, relPath))) {
          if (!options.force) {
            success(`已跳过已存在的文件，若继续执行，请使用 ${chalk.yellow(`--force`)} 在继续 : ${relPath}`)
          }
          continue
        }
        mkdirSync(path.dirname(path.join(workspace, relPath)), { recursive: true })
        fs.copyFileSync(file.path, path.join(workspace, relPath))
      }
    }
  }
}

export default Runner
