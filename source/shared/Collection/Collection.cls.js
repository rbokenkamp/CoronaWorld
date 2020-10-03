module.exports = class Collection extends PreCore.classes.Tree {

  create(params) {
    const {instanceOf, classes} = PreCore
    super.create(params)
    //  params.items
    return this.items
  }

  created(params) {
    const {items} = params,
        {classes, instanceOf} = PreCore

     const data = this.items = instanceOf(items, "Data") ? items : new classes.Data()
    data.__instance = this
    Object.defineProperty(data, "__instance", {
      enumerable: false,
      readonly: true,
    });

    if (items === undefined) {
      return
    }

    for (const key in items) {
      this.setItem(key, items[key], true)
    }
  }

  setItem(key, value, create) {
    const {types, getType} = PreCore,
        {path, item, items} = this,
        {type} = item,
        {kind, cls} = types[type]

    if (value === undefined) {
      return delete items[key]
    }

    if (kind === "Branch") {
      value = cls.validate(this, path + "/" + key, item, value)
      if (value === undefined) {
        return
      }
      if (!create && cls.equals(this[key], value)) {
        return
      }

      items[key] = value
      //@@@ TODO trigger set
      return
    }

    if (getType(value) !== "Object") {
      return items[key] = value
    }

    value.type = value.type === undefined ? type : value.type
    value.parent = this
    value.key = key
    return items[key] = core.instance(value)
  }

}
