const fs = require("fs")
PreCore.classes.ServerDisc = require(__dirname + "/ServerDisc/ServerDisc.cls")


module.exports = class Server extends PreCore.classes.Core {

  create(params) {
    const {home} = params,
        {classes} = PreCore

    this.paths = {}

    this.disc = new classes.ServerDisc()
    this.home = home
    const dependencies = this.getDependencies(),
        paths = {}
    for (const [module, dir] of dependencies) {
      this.scan(module, dir, "")
    }

    this.checkTypes()
    super.create(params)
   }

  checkTypes() {
    const {types} = PreCore,
        {paths} = this

    for (const key in types) {
      if (types[key].type === undefined) {
        this.raise("type_index_missing", {key})
      }
      if (key in paths === false) {
        this.raise("type_cls_missing", {key})
      }
    }

  }

  getDependencies() {
    const {disc, home} = this
    PreCore.modulePaths = {Server: home}
    const rootPath = home.substr(0, home.lastIndexOf("/"))
    const {dependencies} = JSON.parse(disc.get(rootPath + "/package.json").toString("utf8")),
        result = []
    PreCore.modules.Server = []
    result.push(["Server", home])
    for (const key in dependencies) {
      const path = dependencies[key]
      if (path.indexOf("/rbokenkamp/") === -1) {
        continue
      }
      PreCore.modules[key] = []
      const modulePath = `${rootPath}/node_modules/${key}/source`
      result.push([key, modulePath])
      PreCore.modulePaths[key] = modulePath
    }
    return result
  }


  scan(module, home, path) {
    const {types, modules} = PreCore,
        {paths, disc} = this,
        items = disc.get(home + path)


    for (const item of items) {
      const parts = item.split(".")
      if (parts.length === 1) {
        this.scan(module, home, path + "/" + item)
        continue
      }

      if (parts.length !== 3) {
        continue
      }

      const [key, kind, ext] = parts

      if (ext === "js") {
        if (key[0].match(/[A-Z]/) === null) {
          continue
        }
        types[key] = types[key] || {}
        if (kind === "cls") {
          paths[key] = home + path + "/" + item
          continue
        }
        if (kind === "metas") {
          types[key].metas = require(home + path + "/" + item)
          continue
        }
        if (kind === "index") {
          modules[module].push(key)
          let data = require(home + path + "/" + item)
          data = typeof data === "string" ? {type: data} : data
          Object.assign(types[key], {key}, data)
          continue
        }
        if (kind === "instance") {
          types[key].instance = require(home + path + "/" + item)
        }

      }

    }
  }

  requireClass(key) {
    const {paths} = this,
        path = paths[key]

    if (path !== undefined) {
      const cls = PreCore.types[key].cls = PreCore.classes[key] = require(path)
    }

  }


}
