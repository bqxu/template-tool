import path from 'path'
import url from 'url'
import fs, { mkdirSync } from 'fs'

import { createRequire } from 'module'

import {
  lsDirFR,
  pug_compile,
  camelCase,
  CamelCase,
  RunCommanderError,
  info,
  chalk,
  log,
  success,
  prompts,
} from '../../src/index.js'

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

const out_help = async () => {
  log(`Usage: new api -d <dir> --model <model>`)
  log(``)
  log(`生成 api-server 内页面模版`)
  log(``)
  log(`Options:`)
  log(`  -d, --dir <dir>    目录 (default: "./")`)
  log(`  --table <table>    表名称`)
  log(`  --model <model>    model名称(可选参数，默认为：<table>)`)
  log(`  --db <db>          数据库名称(可选参数)`)
  log(`  --app <app>        应用名称(可选参数，默认为：<db>)`)
  log(`  --sub <sub>        子类型<model/router/service/controller>`)
  log(``)
}

const Runner = async (workspace, options) => {
  if (options._.includes('help')) {
    out_help()
    return
  }

  if (!options.model) {
    out_help()
    throw new RunCommanderError('请设置参数 --model')
  }

  const app = options.app || options.db || ''
  let table_name = options.table
  if (options.db) {
    table_name = `${options.db}.${options.table}`
  }

  let model_name = options.model || options.table

  let pattern = ['*']

  if (options.sub) {
    if (!config.commmand[options.sub]) {
      throw new RunCommanderError(`未匹配到有效的 --sub ${options.sub}`)
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

      const data = {
        ...options,
        table_name,
        method_add: CamelCase(`${model_name}_add`),
        method_info: CamelCase(`${model_name}_info`),
        method_page: CamelCase(`${model_name}_page`),
        method_update: CamelCase(`${model_name}_update`),
        file_add: page_name(app, model_name, 'add'),
        file_info: page_name(app, model_name, 'info'),
        file_page: page_name(app, model_name, 'page'),
        file_update: page_name(app, model_name, 'update'),
      }

      if (file.path.endsWith('.pug')) {
        let relPath = file.relPath
        relPath = relPath.substring(0, relPath.length - 4)
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
          }
          continue
        }
        mkdirSync(path.dirname(path.join(workspace, relPath)), { recursive: true })
        fs.copyFileSync(file.path, path.join(workspace, relPath))
      }
    }
  }
  success('执行成功！')
}

export default Runner
