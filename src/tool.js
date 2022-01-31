import chalk from 'chalk'
import path from 'path'
import url from 'url'
import os from 'os'
import fs from 'fs'
import { createRequire } from 'module'

import minimist from 'minimist'

import pug from 'pug'

const require = createRequire(import.meta.url)

export const config_dir_name = '.gen-code'

export const cwd = () => {
  return process.cwd()
}

const file_name = () => {
  return url.fileURLToPath(import.meta.url)
}

const dir_name = () => {
  return path.dirname(file_name())
}

export const bin_dir = () => {
  return path.resolve(dir_name(), '..')
}

export const user_home = () => {
  return os.homedir()
}

export const user_tmp = () => {
  return os.tmpdir()
}

export const global_dir = () => {
  return path.join(user_home(), config_dir_name)
}

export const project_dir = () => {
  let current = cwd()
  // console.log(`cwd`, cwd())
  let i = 0
  while (current) {
    if (!fs.existsSync(current)) {
      return null
    }
    if (fs.existsSync(path.join(current, config_dir_name))) {
      return path.join(current, config_dir_name)
    }
    if (current == '/') {
      return null
    }
    current = path.dirname(current)
  }
  return null
}

export const log = (...string) => {
  console.log(chalk.white(string))
}

export const info = (...string) => {
  console.log(chalk.yellow(string))
}

export const error = (...string) => {
  console.log(chalk.red(string))
}

export const success = (...string) => {
  console.log(chalk.cyan(string))
}

export const isDir = (filepath) => {
  return fs.lstatSync(filepath).isDirectory()
}

export const isFile = (filepath) => {
  return fs.lstatSync(filepath).isFile()
}

export const lsDirD = (dir) => {
  if (!fs.existsSync(dir)) {
    // log(`${dir} not exists`)
    return []
  }
  return fs
    .readdirSync(dir)
    .filter((filePath) => {
      return isDir(path.join(dir, filePath))
    })
    .map((tpl) => {
      return { name: tpl, path: path.join(dir, tpl) }
    })
}

export const readJson = async (filepath) => {
  if (!fs.existsSync(filepath)) {
    // log(`${filepath} not exists`)
    return null
  }
  return JSON.parse(await fs.readFileSync(filepath, { encoding: 'utf-8' }))
}

export const exec_file_2 = async (filepath) => {
  return require(filepath)
}

export const exec_file = async (filepath) => {
  return new Promise((resolve, reject) => {
    import(filepath).then((module) => {
      resolve(module.default)
    })
  })
}

export const build_options = (args) => {
  const options = {
    args,
    ...minimist(args),
  }

  return options
}

export const lsDirFR = (dir, root) => {
  root = root || dir
  if (!fs.existsSync(dir)) {
    log(`${dir} not exists`)
    return []
  }
  let res = []

  let files = fs
    .readdirSync(dir)
    .filter((filePath) => {
      return isFile(path.join(dir, filePath))
    })
    .map((tpl) => {
      let file_path = path.join(dir, tpl)
      return { name: tpl, path: file_path, relPath: path.relative(root, file_path) }
    })

  res.push(...files)

  let dirs = fs
    .readdirSync(dir)
    .filter((filePath) => {
      return isDir(path.join(dir, filePath))
    })
    .map((tpl) => {
      let file_path = path.join(dir, tpl)
      return { name: tpl, path: file_path }
    })

  for (let i = 0; i < dirs.length; i++) {
    let subFile = lsDirFR(dirs[i].path, root)
    res.push(...subFile)
  }
  return res
}

export const lsDirNotEmpity = (dir) => {
  if (!fs.existsSync(dir)) {
    return false
  }
  let childs = fs.readdirSync(dir)
  return childs.length > 0
}

export const char0UpperCase = function (str) {
  return `${str[0].toUpperCase()}${str.substring(1)}`
}

export const camelCase = (str) => {
  return str.replace(/[-_.](\w)/g, function ($0, $1) {
    return $1.toUpperCase()
  })
}

export const CamelCase = (str) => {
  str = camelCase(str)
  return `${str[0].toUpperCase()}${str.substring(1)}`
}

export const underScoreCase = (str) => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

export const pug_compile = (pugFile, args) => {
  const compiledFunction = pug.compileFile(pugFile)
  return compiledFunction(args)
}
