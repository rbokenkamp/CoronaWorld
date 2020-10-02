module.exports = class extends PreCore.classes.Tree {

  static validate(instance, path, meta, data) {
    data = PreCore.classes.Branch.validate(instance, path, meta, data)
    if (data === undefined) {
      return
    }

    if (PreCore.typeof(data) !== "Array") {
      instance.raise("list_not_an_array", {path})
    }

    const {item, count} = meta,
        {classes} = PreCore

    if (count !== undefined && data.length !== count) {
      this.raise("list_invalid_count", {path: instance.path, expected: count, actual: data.length})
    }
//    let {item} = meta
//    if (typeof item === "string") {
//      item = {type: item}
//    }
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
