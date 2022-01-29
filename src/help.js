/**
 * 配置全局帮助格式
 */
export const configureHelp = (program) => {
  program.configureHelp({
    sortSubcommands: false,
    subcommandTerm: (cmd) => cmd.name(), // Just show the name, instead of short usage.
  })
}
