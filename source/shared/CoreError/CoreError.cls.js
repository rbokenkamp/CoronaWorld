module.exports = class CoreError extends Error {
  constructor(message, code, params) {
    super(message)
    let stack, index
    if (typeof message === "string") {
      this.code = code
      this.params = params
      stack = this.stack
      index = 1
    } else {
      stack = message.stack
      message = message.message
      index = 0
    }
    const lines = []
    for (const line of stack.split("\n")) {
      line.replace(/([\/\w\.]+):(\d+)(?::(\d+))?/g, (_, path, line, column) => {
        path = path.substr(0, path.lastIndexOf(".")).replace(/^.*?\/source\//, "/")
        if (path === "") {
          return
        }
        line = +line
        // for client (browser) an extra line is added on top
        lines.push([path, PreCore.types.Client ? line - 1 : line, +column])
        //  lines.push([path, core.classes.Client ? line-1 : line, +column])
      })
    }

    if (index === 1) {
      lines.shift()
    }
    this.trace = lines
    const [path, line, column] = lines[0]
    Object.assign(this, {path, line, column})
  }
}
