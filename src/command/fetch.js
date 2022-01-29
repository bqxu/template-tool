import { Command } from 'commander'
import { FetchGitCommand } from './fetch/git.js'
import { FetchGithubCommand } from './fetch/github.js'
import { FetchGitlabCommand } from './fetch/gitlab.js'
import { FetchGogsCommand } from './fetch/gogs.js'
import { FetchNpmCommand } from './fetch/npm.js'

/**
 * 命令：拉取远超模版
 */
export const FetchCommand = () => {
  const command = new Command('fetch')
    .addCommand(FetchGitCommand())
    .addCommand(FetchNpmCommand())
    .addCommand(FetchGithubCommand())
    .addCommand(FetchGitlabCommand())
    .addCommand(FetchGogsCommand())
    .description('拉取远程仓库')
  return command
}
