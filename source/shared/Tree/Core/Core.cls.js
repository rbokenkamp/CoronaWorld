module.exports = class Core extends PreCore.classes.EventHandler {


  create(params) {
    this.initClasses()
    this.initTypes()
    this.validateMetas()
    console.log("VALIDATED")

    params.errors = PreCore.errors
    params.types = PreCore.types

   super.create(params)
    /*
      Object.assign(this.instances, PreCore.instances)
     PreCore.instances = this.instances
     PreCore.core = this
 */
  }

   initClasses() {
    const {classes} = PreCore
    for (const key in classes) {
      const cls = classes[key]
      if (typeof cls !== "function" || cls.toString().indexOf("class") !== 0) {
        this.raise("type_not_a_class", {path: key})
      }

      if (cls.name !== key) {
        this.raise("class_no_name", {key})
      }
    }
  }

  initTypes() {
    const {types, errors, merge} = PreCore,
        processing = Object.assign({}, types)

    let incomplete = true
    while (incomplete) {
      incomplete = false
      for (const key in processing) {

        const type = types[key],
            {extend} = type

        if (extend !== undefined && extend in types === false) {
          this.raise("extended_class_not_found", {key: extend, path: `/types/${key}/extend`})
        }
        if (extend !== undefined && extend in processing === true) {
          incomplete = true
          continue
        }


        Object.assign(errors, type.errors)
        this.requireClass(key)
        type.metas = type.metas || {}
        types[key] = extend ? merge(types[extend], type) : type
        delete processing[key]
      }
    }
  }

  validateMetas() {
    const {types, classes} = PreCore
     for (const key in classes) {
      const {metas, instance} = types[key]
      for (const name in metas) {
        metas[name] = types.Meta.cls.validate(this, "/types/" + key + "/metas/" + name, {
          type: "Meta",
        }, metas[name])
      }
      if (instance) {
        for (const name in instance) {
          instance[name] = types.Meta.cls.validate(this, "/types/" + key + "/instance/" + name, {
            type: "Meta",
          }, instance[name])
        }
      }
    }
  }


  requireClass(key) {
  }

  instance(params, branch) {
    const cls = PreCore.classes[params.type]
        branch = branch || new cls()
    branch.build(params)
    return branch
  }
}

/*
  instance(params) {
    const {type} = params,
        {classes} = PreCore

    if (type in classes) {
      const branch = new classes[type]
      branch.create(params)
      branch.created()

    }
  }

 */
