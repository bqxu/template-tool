import path from 'path'
import url from 'url'
import fs, { mkdirSync } from 'fs'

import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const config = require('./package.json')

const file_name = () => {
  return url.fileURLToPath(import.meta.url)
}

const dir_name = () => {
  return path.dirname(file_name())
}
const Runner = async (workspace, options) => {
  if (config.template == 'none') {
    mkdirSync(workspace, { recursive: true })
    fs.cpSync(path.join(dir_name(), 'tpl/'), workspace, { recursive: true })
  }
}

export default Runner
