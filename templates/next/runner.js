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
const Runner = async (workspace, options) => {
  if (!options.page) {
    throw new RunCommanderError('请设置参数 --page')
  }
  if (config.template == 'pug') {
    mkdirSync(workspace, { recursive: true })

    let files = lsDirFR(path.join(__dir_name(), 'tpl/'))
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      if (file.path.endsWith('.pug')) {
        let basename = path.basename(file.path, '.pug')
        let fileStr = pug_compile(file.path, {
          page: camelCase(options.page),
          Page: CamelCase(options.page),
        })
        basename = basename.replace(/\[(\w+)\]/g, function (str, rep_str) {
          return options[rep_str] || rep_str
        })
        fs.writeFileSync(path.join(workspace, basename), fileStr, { encoding: 'utf-8' })
      } else {
        let basename = path.basename(file.path)
        basename = basename.replace(/\[(\w+)\]/g, function (str, rep_str) {
          return options[rep_str] || rep_str
        })
        fs.copyFileSync(file.path, path.join(workspace, basename))
      }
    }
  }
}

export default Runner
