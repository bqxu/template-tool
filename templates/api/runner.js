import path from 'path'
import url from 'url'
import fs, { mkdirSync } from 'fs'

import { createRequire } from 'module'

import { lsDirFR, pug_compile, camelCase, CamelCase, RunCommanderError } from '../../src/index.js'

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
  const app = options.app || options.db || ''
  let table_name = options.table || options.model
  let db_table_name = table_name
  if (db) {
    db_table_name = `${db}.${table_name}`
  }

  const sub = options.sub || 'all'
  const pattern = config.commmand[sub] || ['*']

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
        method_add: CamelCase(`${db_table_name}_add`),
        method_info: CamelCase(`${db_table_name}_info`),
        method_page: CamelCase(`${db_table_name}_page`),
        method_update: CamelCase(`${db_table_name}_update`),
        page_add: page_name(app, table_name, 'add'),
        page_info: page_name(app, table_name, 'info'),
        page_page: page_name(app, table_name, 'page'),
        page_update: page_name(app, table_name, 'update'),
      }
      if (file.path.endsWith('.pug')) {
        let basename = path.basename(file.path, '.pug')
        let fileStr = pug_compile(file.path, data)
        basename = basename.replace(/\[(\w+)\]/g, function (str, rep_str) {
          console.log(rep_str)
          return data[`page_${rep_str}`] || data[rep_str] || rep_str
        })
        fs.writeFileSync(path.join(workspace, basename), fileStr, { encoding: 'utf-8' })
      } else {
        let basename = path.basename(file.path)
        basename = basename.replace(/\[(\w+)\]/g, function (str, rep_str) {
          console.log(rep_str)
          return data[`page_${rep_str}`] || data[rep_str] || rep_str
        })
        fs.copyFileSync(file.path, path.join(workspace, basename))
      }
    }
  }
}

export default Runner
