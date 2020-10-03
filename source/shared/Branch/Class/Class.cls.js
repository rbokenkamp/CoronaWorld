module.exports = class Class extends PreCore.classes.Branch {

  static validate(instance, path, meta, data) {
    data = super.validate(instance, path, meta, data)
    if (data === undefined) {
      return
    }
    if (typeof data !== "function" || data.toString().indexOf("class")!== 0) {
      instance.raise("class_invalid_type", {path})
    }
    return data
  }

  static equals(a, b) {
    return a.toString() === b.toString()
  }

}
