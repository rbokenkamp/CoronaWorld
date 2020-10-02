const Tree = module.exports = class extends PreCore.classes.Branch {


  createFromMeta(key, meta, params) {
    const {types, classes} = PreCore,
        {type, internal} = meta,
        {path} = params

    if (internal === true) {
      return
    }

    const {kind} = types[type]

    if (kind !== "Branch") {
      return key
    }

    console.log("+++", path, key)
    return classes[type].validate(this, path + "/" + key, meta, params[key])
  }

  create(params) {
    const instance = this.__instance = params.__instance || this
    Object.defineProperty(this, "__instance", {
      enumerable: false,
    })

    const {classes, instances, types} = PreCore,
        {type, parent} = params,
        id = params.id = Tree.index++
    params.path = parent ? parent.__instance.path + "/" + params.key : ""

    instances[id] = this

    if (type in classes === false) {
      this.raise("type_not_exists",)
    }

    console.log("+-", "CREATE", type, "+-".repeat(80))
    const typeObj = types.Server
    const typeObj2 = types[type]
    const metas = types[type].instance
    console.log("@@@ metas @@@")
    const queue = []
    for (const key in metas) {
      const result = this.createFromMeta(key, metas[key], params)
      if (result !== undefined) {
        queue.push(result)
        this[key] = result
      }
    }
    console.log("@@@ data @@@")
    for (const key in params) {
      console.log(key)
    }
  }

  created(params) {

  }

  static validate(instance, path, meta, data) {
    const {types} = PreCore

    if (typeof data === "string") {
      data = {type: data}
    }


    data = super.validate(instance, path, meta, data)

    if (data === undefined) {
      return
    }
    const {type} = data
    if (type in types === false) {
      instance.raise("type_not_exists", {path, type})
    }

    meta = types[type].metas


    for (const key in data) {
      if (key in meta === false) {
        instance.raise("tree_unknown_param", {path: path + "/" + key})
      }
    }

    for (const key in meta) {
      let itemMeta = meta[key]
      if (typeof itemMeta === "string") {
        itemMeta = {type: itemMeta}
      }
      const itemType = itemMeta.type
      if (itemType in types === false) {
        instance.raise("type_not_exists", {path: path + "/" + key, type: itemType})
      }

      if (itemMeta.determined === true || itemMeta.internal === true) {
        continue
      }

      const result = types[itemType].cls.validate(instance, path + "/" + key, itemMeta, data[key])
      if (result !== undefined) {
        data[key] = result
      }
    }

    return data
  }

}

Tree.index = 0
