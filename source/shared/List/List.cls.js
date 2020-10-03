module.exports = class List extends PreCore.classes.Tree {

  static validate(instance, path, meta, data) {
    const {classes, getType} = PreCore
    data = classes.Branch.validate(instance, path, meta, data)
    if (data === undefined) {
      return
    }

    if (getType(data) !== "Array") {
      instance.raise("list_not_an_array", {path})
    }

    let {item, count} = meta

    if (count !== undefined && data.length !== count) {
      this.raise("list_invalid_count", {path: instance.path, expected: count, actual: data.length})
    }

    item = typeof item === "string" ? {type: item} : item
    const {type} = item

    if (type in classes === false) {
      instance.raise("type_not_exists", {path, type})
    }

    const cls = classes[type]
    for (const name in data) {
      const result = data[name] = cls.validate(instance, path + "/" + name, item, data[name])
      if (result === undefined) {
        delete data[name]
      }
    }
    return data
  }

}
