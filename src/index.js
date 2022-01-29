#!/usr/bin/env node
import { Command, Option } from 'commander'
import chalk from 'chalk'

import { FetchCommand } from './command/fetch.js'
import { LsCommand } from './command/ls.js'
import { RunCommand } from './command/run.js'
import { TemplateCommand } from './command/template.js'
import { configureHelp } from './help.js'
import { configureOutput } from './output.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const config = require('../package.json')

export const version = config.version

export * from './tool.js'
export * from './error.js'

export { default as chalk } from 'chalk'
export { default as prompts } from 'prompts'

export const run = async () => {
  const program = new Command()
  program.version(config, '-v, --version', '显示版本号')

  program.exitOverride()

  configureOutput(program)
  configureHelp(program)

  /**
   * 添加命令
   */
  program
    .addCommand(LsCommand())
    .addCommand(FetchCommand())
    .addCommand(RunCommand())
    .addCommand(TemplateCommand())
    .description('代码自动生成工具')
    .showHelpAfterError()

  await program.parseAsync(process.argv)
}
