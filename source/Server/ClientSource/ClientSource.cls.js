const fs = require("fs"),
    zlib = require("zlib"),
    sass = require('sass'),
    {max} = Math

const ClientSource = module.exports = class extends PreCore.classes.Tree {

  create(params, options) {
    super.create(params, options)

    this.wwws = []
    this.sources = []
    this.sassPaths = []
    this.initialize()

    this.watches = []
    if (process.env.DEMO_ENV === "dev") {
      this.addWatches()
    } else {
      this.addCoronaDataWatchForAws()
    }
  }


  require(path) {
    delete require.cache[path]
    return require(path)
  }


  initialize() {
    const {wwws, sources, sassPaths} = this,
        {modulePaths, toSource} = PreCore,
        {disc} = core,
        paths = this.paths = {},
        required = {},
        data = this.data = {
          types: {},
          templates: {},
          styles: {},
          required,
        }

    this.timestamps = {}

    const classes = {}

    for (const key in modulePaths) {
      const path = modulePaths[key],
          wwwPath = path + "/_www",
          clientPath = path + "/_Client",
          sharedPath = path + "/shared",
          sassPath = path+"/sass"

      if (disc.exists(wwwPath)) {
        wwws.push(wwwPath)
        this.scanWww(wwwPath, "")

      }
      if (disc.exists(sassPath)) {
        sassPaths.push(sassPath)
      }
      if (disc.exists(sharedPath)) {
        sources.push(sharedPath)
        this.scanSource(sharedPath, "", classes)
      }
      if (disc.exists(clientPath)) {
        sources.push(clientPath)
        this.scanSource(clientPath, "", classes)
      }
    }

    this.getTypes(classes)

    //  const requiredKeys = Object.keys(required).map(item => item + ".js")
    //  requiredKeys.unshift("/")
    //  paths["/js/worker.js"] = paths["/js/worker.js"].toString("utf8").replace('"@@@"', Branch.toSource(requiredKeys))

    for (const key in ClientSource.ignore) {
      delete required[key]
    }
    const content = "Object.assign(PreCore, " + toSource({
      types: data.types, required: data.required,
      templates: data.templates, styles: data.styles
    }) + ")"
    this.setContent("/js/PreCoreData.js", content, undefined, true)
  }

  setContent(path, content, timestamp, deflate) {
    const {paths, timestamps} = this
    paths[path] = deflate ? zlib.deflateSync(content) : content
    if (timestamp !== undefined) {
      timestamps[path] = timestamp
    }
  }

  initType() {
    const content = this.paths["/js/PreCoreData.js"]
    eval(zlib.inflateSync(content).toString("utf8"))
    this.data = Object.assign(module.exports, this.data)
  }

  scanWww(home, path) {
    const {timestamps, paths, data} = this,
        {required} = data,
        items = fs.readdirSync(home + path)

    for (const item of items) {
      if (item[0] === "." || item[0] === "_") {
        continue
      }

      const itemPath = path + "/" + item,
          index = item.lastIndexOf(".")

      if (index === -1) {
        this.scanWww(home, itemPath)
        continue
      }

      const {mtimeMs} = fs.statSync(home + itemPath),
          content = fs.readFileSync(home + itemPath),
          ext = item.substr(index + 1)

      this.setContent(itemPath, content, mtimeMs, PreCore.classes.Http.deflatable[ext])
      if (ext === "js") {
        required[itemPath.substr(0, itemPath.length - 3)] = null
      }
    }
  }

  scanSource(home, path, classes) {
    const {timestamps, paths, data} = this,
        {types, templates, styles} = data,
        items = fs.readdirSync(home + path)

    for (const item of items) {
      if (item[0] === "." || item[0] === "_") {
        continue
      }

      const itemPath = path + "/" + item,
          parts = item.split("."),
          length = parts.length

      if (length === 1) {
        this.scanSource(home, itemPath, classes)
        continue
      }

      if (length !== 3) {
        continue
      }

      const [key, kind, ext] = parts,
          {mtimeMs} = fs.statSync(home + itemPath)

      if (ext === "js") {
        if (kind === "cls") {
          types[key] = key in types ? types[key] : {}
          const content = "{\n" + fs.readFileSync(home + itemPath, "utf8") + "}\n"
          this.setContent("/classes/" + key + ".js", content, mtimeMs, true)
          classes[key] = null
          continue
        }
        if (kind === "metas") {
          types[key].metas = this.require(home + itemPath)
          timestamps["/js/PreCoreData.js"] = max(timestamps["/js/PreCoreData.js"], mtimeMs)
          continue
        }
        if (kind === "instance") {
          types[key].instance = this.require(home + itemPath)
          timestamps["/js/PreCoreData.js"] = max(timestamps["/js/PreCoreData.js"], mtimeMs)
          continue
        }
        if (kind === "index") {
          types[key] = key in types ? types[key] : {}
          Object.assign(types[key], this.require(home + itemPath))
          timestamps["/js/PreCoreData.js"] = max(timestamps["/js/PreCoreData.js"], mtimeMs)
          continue
        }
        continue
      }

      const content = fs.readFileSync(home + itemPath, "utf8")
      if (ext === "html" && kind === "template") {
        templates[key] = content
        timestamps["/js/PreCoreData.js"] = max(timestamps["/js/PreCoreData.js"], mtimeMs)
        continue
      }
      if (ext === "scss" && kind === "style") {
        const options = {data: content, includePaths: this.sassPaths}
        styles[key] = sass.renderSync(options).css.toString("utf8")
        timestamps["/js/PreCoreData.js"] = max(timestamps["/js/PreCoreData.js"], mtimeMs)
        continue
      }
    }

  }

  getTypes(classes) {
    const {data} = this,
        {types, required} = data
    let incomplete = true
    while (incomplete) {
      incomplete = false
      for (const key in classes) {
        const params = types[key],
            {extend, errors} = params
        if (extend !== undefined && extend in types === false) {
          this.raise("extended_class_not_found", {key: extend, path: "/types/" + key + "/extend"})
        }
        if (extend !== undefined && extend in classes === true) {
          incomplete = true
          continue
        }

        required["/classes/" + key] = null
        delete classes[key]
      }
    }
  }

  addCoronaDataWatchForAws() {
    const {home} = core,
        {watches} = this,
        path = home + "/Corona/data/timeline"

    const watch = fs.watch(path, (type, file) => {
      if (file[file.length - 1].match(/[a-zA-Z0-9]/) === null) {
        return
      }

      const full = path + "/" + file,
          content = fs.readFileSync(full),
          {mtimeMs} = fs.statSync(full)
      this.setContent(`/data/timeline/${file}`, content, mtimeMs, true)
    })
    watches.push(watch)
  }

  addWatches() {
    const {sources, wwws, watches} = this
    for (const home of wwws) {
      const watch = fs.watch(home, {recursive: true}, (type, path) => {
        if (path[path.length - 1].match(/[a-zA-Z0-9]/) === null) {
          return
        }

        path = "/" + path

        try {
          this.initialize()
          console.log(`@@@ recompile [${home}] success @@@`)
        } catch (err) {
          console.log(err)
          console.log(`@@@ recompile [${home}] failed @@@`)
        }
      })
      watches.push(watch)
    }
    for (const home of sources) {
      const watch = fs.watch(home, {recursive: true}, (type, path) => {
        if (path[path.length - 1].match(/[a-zA-Z0-9]/) === null) {
          return
        }

        path = "/" + path
        const item = path.substr(path.lastIndexOf("/") + 1),
            parts = path.split(".")

        if (parts.length === 3) {
          const [key, kind, ext] = parts
          if ((ext === "js" && (kind === "cls" || kind === "metas" || kind === "index" || kind === "instance")) ||
              (ext === "html" && kind === "template") ||
              (ext === "scss" && kind === "style")) {
            try {
              this.initialize()
              console.log(`@@@ recompile [${home}] success @@@`)
            } catch (err) {
              console.log(`@@@ recompile [${home}] failed @@@`)
            }
          }
        }
      })
      watches.push(watch)
    }
  }

  release() {
    const {watches} = this

    for (const watch of watches) {
      watch.close()
    }
  }

}

ClientSource.ignore = {
  "/js/PreCore": true,
  "/js/Dom": true,
  "/js/Boot": true,
  "/js/worker": true,
}
