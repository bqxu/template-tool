export class RunCommanderError extends Error {
  constructor(command, message) {
    super(message)
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor)
    this.command = command
    this.name = this.constructor.name
    this.exitCode = 1
  }
}
