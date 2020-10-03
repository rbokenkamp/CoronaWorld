const fs = require("fs")

const ServerDisc = module.exports = class ServerDisc extends PreCore.classes.Disc {

  create(params) {
    super.create(params)
  }

  exists(path) {
    return fs.existsSync(path)
  }

  get(path) {
    if (fs.existsSync(path) === false) {
      return
    }
    const i = path.lastIndexOf(".")
    if (i === -1) {
      return fs.readdirSync(path).filter(item => item[0] !== "." && item[0] !== "_" && item in ServerDisc.ignore === false)
    }
    return fs.readFileSync(path)
  }

  set(path) {

  }


}

ServerDisc.ignore = {
  node_modules: true,
}
