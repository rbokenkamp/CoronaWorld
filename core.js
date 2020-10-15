process.on('uncaughtException', err => {
  console.log('UNCAUGHT:', err)
})
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
})


process.title = "core"
require("./index")
// const data = new PreCore.classes.Data()
//console.log(data, typeof data, data.constructor.name)
// process.exit()
const {Server} = PreCore.classes
    params = require("./core.params.js")

global.core = new Server()

try {
  const t0 = Date.now()
  core.instance(params, core)
  console.log("elapsed", Date.now() - t0)
  const release = () => core.signal("release")
  process.on("SIGINT", release)
  process.on("SIGHUB", release)
  process.on("SIGQUIT", release)

  /*
    core.create(params)
    core.listen({event: "queue-empty"}, () => {
      //  console.log("@@@ empty @@@")
      //  core.signal("release")
    }, true)

   */
} catch (err) {
  const {CoreError} = PreCore.classes
  if (err instanceof CoreError === false) {
    err = new CoreError(err)
  }
  const {message, code, params, path, line, column, trace} = err
  console.log("@@@ error @@@", {message, code, params, path, line, column, trace})

}

