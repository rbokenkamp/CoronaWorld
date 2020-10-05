{
  const Boot = class {
    constructor() {
      const queue = this.queue = Object.keys(PreCore.required)
      delete PreCore.required
      this.paths = {}
      this.load()
    }


    load(path) {
      if (path) {
        PreCore.set(path, module.exports)
      }

      const {queue} = this

      if (queue.length === 0) {
        this.processClasses()
        return this.start()
      }

      path = queue.shift()
      const script = Dom.create({
        parent: document.head,
        tag: "script",
        attributes: {
          src: `${path}.js`,
        }
      })
      script.onload = e => this.load(path)
    }

    processClasses() {
      const classes = PreCore.get("/classes"),
          {paths} = this
      for (const key in classes) {
        PreCore.types[key].cls = classes[key]
        paths[key] = null
      }

    }


    start() {
      const {classes} = PreCore,
          params = PreCore["core.index"],
          {type} = params
      params.key = "core"
      console.log("@@@ PreCore @@@", PreCore)
      if (type in classes === false) {
        console.log(`Type /type/${type} does not exist`)
        return
      }
      window.core = new PreCore.classes[type]()
      core.paths = this.paths
      delete this.paths
      params.countries = PreCore.data.countries
      try {
        core.instance(params, core)
        console.log("@@@ core @@@", core)
        //core.schedule("/setBranch", "dashboard", dashboard)
        window.onresize = () => core.signal("draw")

      } catch (err) {
        const {CoreError} = PreCore.classes
        if (err instanceof CoreError === false) {
          err = new CoreError(err)
        }
        const {message, code, params, path, line, column, trace} = err
        console.log("@@@ error @@@", {message, code, params, path, line, column, trace})
        PostCore.log({message, code, params, path, line, column, trace})

      }
    }
  }
  new Boot()
}

