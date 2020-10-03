const Tree = module.exports = class Tree extends PreCore.classes.Branch {


  createFromMeta(key, meta, params) {
    const {types, classes} = PreCore,
        {branches} = this,
        {type, internal} = meta,
        {path} = params

    if (internal === true) {
      return
    }

    const {kind} = types[type]

    if (kind !== "Branch") {
      branches.push(key)
      return
    }

    return classes[type].validate(this, path + "/" + key, meta, params[key])
  }

  create(params) {
    const {classes, instances, types, getType} = PreCore

    const {type, parent, key} = params,
        id = params.id = Tree.index++,
        path = params.path = parent ? parent.path + "/" + key : ""


    if (type === undefined) {
      this.raise("branch_required", {path: path + "/type"})
    }

    instances[id] = this

    if (type in classes === false) {
      this.raise("type_not_exists",)
    }

    const metas = types[type].instance
    const branches = this.branches = []
    for (const key in metas) {
      const value = this.createFromMeta(key, metas[key], params)
      if (value !== undefined) {
        this[key] = value
      }
    }

    for (const key in params) {
      if (key in metas === false) {
        this.raise("tree_unknown_param", {path: path + "/" + key})
      }
    }

    this.init && this.init(params)
    this.created(params)
    return this
  }


  branch(params) {
    const {type, key} = params,
        {classes, types, instanceOf} = PreCore

    if (type in classes === false) {
      this.raise("type_not_exists", {type, path: this.path + "/" + key})
    }
    if (key in this === true) {
      return this[key].set(params)
    }
    params.parent = this

    const instance = core.instance(params)
    return this[key] = instanceOf(instance, "Collection") ? instance.items : instance
  }

  created(params) {
    const {branches} = this,
        {types, classes, merge} = PreCore,
        metas = types[this.type].instance

    for (const key of branches) {
      const meta = metas[key],
          {type} = meta,
          {kind} = types[type]

      if (kind === "Tree") {
        let value = classes.Branch.validate(this, this.path + "/" + key, meta, params[key])
        console.log(key, value)
        if (value === undefined) {
          continue
        }
        if (typeof value === "string") {
          value = {type: value}
        }
        value.type = value.type || meta.type
        value.key = key
        this.branch(value)
        return
      }
      let items = classes.Branch.validate(this, this.path + "/" + key, meta, params[key])
      if (items === undefined) {
        continue
      }
      let value = merge(meta, {key, items})
      this.branch(value)
    }
  }

  static validate(instance, path, meta, data) {
    const {types} = PreCore

    if (typeof data === "string") {
      data = {type: data}
    }

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

      if (key === "choices") {
        const x = 1
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
