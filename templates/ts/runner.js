import path from 'path'
import url from 'url'
import fs, { mkdirSync } from 'fs'

import { createRequire } from 'module'

import { lsDirFR } from '../../src/index.js'

const require = createRequire(import.meta.url)

const config = require('./package.json')

const file_name = () => {
  return url.fileURLToPath(import.meta.url)
}

const dir_name = () => {
  return path.dirname(file_name())
}
const Runner = async (workspace, options) => {
  if (config.template == 'pug') {
    mkdirSync(workspace, { recursive: true })

    let fils = lsDirFR(path.join(dir_name(), 'tpl/'))
    console.log(fils)
  }
}

export default Runner
