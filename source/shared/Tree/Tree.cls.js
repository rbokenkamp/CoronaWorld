const Tree = module.exports = class Tree extends PreCore.classes.Branch {


  createFromMeta(key, meta, params) {
    const {types, classes} = PreCore,
        {type, internal} = meta,
        {path} = params

    if (internal === true) {
      return
    }

    const {kind} = types[type]

    if (kind !== "Branch") {
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

    return this
  }

  build(params) {
    this.create(params)
    this.init && this.init(params)
    this.created(params)
  }

  created(params) {
    const {types, classes, merge} = PreCore,
        metas = types[this.type].instance

    for (const key in metas) {
      this.setBranch(key, params[key], true)
    }
  }

  setBranch(key, value, isCreate, originator) {
    const path = this.path + "/" + key,
        {types, classes, merge} = PreCore,
        metas = types[this.type].instance,
        meta = metas[key]

    if (meta === undefined) {
      this.raise("tree_unknown_param", {path: path})
    }

    const {type, internal, updatable} = meta,
        {kind, cls} = types[type]

    if (internal) {
      if (isCreate) {
        return
      }
      this.raise("tree_internal_param", {path: path})
    }

    if (updatable === false && !isCreate) {
      this.raise("tree_non_updatable", {path: path})
    }

    if (kind === "Branch") {
      if (isCreate) {
        return
      }
      value = cls.validate(this, path, meta, value)
      if (value === undefined) {
        if (this[key] !== undefined) {
          core.trigger({event: "set", path, value, originator})
          delete this[key]
        }
        return
      }

      if (cls.equals(this.value, value)) {
        return
      }
      this[key] = value
      core.trigger({event: "set", path, value, originator})
      return value
    }

    let branch = this[key]
    if (branch !== undefined) {
       return branch.set(value)
    }

    if (kind === "Tree") {
      value = classes.Branch.validate(this, this.path + "/" + key, meta, value)
      if (value === undefined) {
        return
      }
      if (typeof value === "string") {
        value = {type: value}
      }
      value.type = value.type || meta.type
      value.key = key
      branch = this[key] = this.branch(value)
      core.trigger({event: "set", path})
      return branch
    }
    let items = classes.Branch.validate(this, this.path + "/" + key, meta, value)
    if (items === undefined) {
      return
    }
    value = merge(meta, {key, items})
    branch = this[key] = this.branch(value)
    core.trigger({event: "set", path})
    return branch
  }

  set(params, path, originator) {
    if (path) {
      path = path.substr(1)
      const index = path.indexOf("/")
      if (index === -1) {
        return this.setBranch(path, params, false, originator)
      }
      return this[path.substr(0, index)].set(params, path.substr(index ), originator)
    }

    for (const key in params) {
      if (key === undefined) {
        // @@@ TODO -> REMOVE BRANCH
        continue
      }
      this.setBranch(key, params[key], false, originator)
    }
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

    const {kind} = types[type]
    const cls = PreCore.classes[params.type]
    const branch = new cls()
    if (kind === "Collection") {
      if (!instanceOf(params.items, "Data")) {
        params.items = new classes.Data(params.items)
      }
      this[key] = params.items
    }
    else {
      this[key] = branch
    }
    core.instance(params, branch)
    return this[key]
  }


  signal(name, params) {
    if (name in this) {
      this[name](params)
    }

    const {types} = PreCore,
        metas = types[this.type].instance

    for (const key in this) {
      if (key in metas === false) {
        //  console.log("+-".repeat(3), (this.path) + "/" + key, "not in metas")
        continue
      }
      const {type, internal} = metas[key],
          kind = types[type].kind

      if ((!internal) && kind !== "Branch") {
        let target = this[key]
        target = "__instance" in target ? target.__instance : target
        target.signal(name, params)
      }
    }
  }


  getBranch(key) {
    return this.__instance ? this.__instance[key] : this[key]
  }

  getInstance() {
    return this
  }

  get(path) {
    if (path === undefined || path === "") {
      return this
    }

    const parts = path.split("/")
    let current = this
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i]
      if (part in current === false) {
        return
      }
      current = current[part]
    }
    return current

  }

  listen(filter, handler, once) {
    const id = core.listen(filter, handler, once)
    if ("listening" in this === false) {
      this.listening = []
    }
    this.listening.push(id)
  }


  release() {
    const {listening} = this,
        {events} = core
    if (listening === undefined) {
      return
    }
    for (const id of listening) {
      events.unlisten(id)
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
