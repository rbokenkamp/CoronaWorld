module.exports = class extends PreCore.classes.Module {


  create(params) {
    this.initTypes()

    this.validateMetas()

    params.errors = PreCore.errors
    params.types = PreCore.types

    super.create(params)
    /*
      Object.assign(this.instances, PreCore.instances)
     PreCore.instances = this.instances
     PreCore.core = this
 */
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
