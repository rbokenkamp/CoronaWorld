module.exports = class extends PreCore.classes.Branch {

  static validate(instance, path, meta, data) {
    data = super.validate(instance, path, meta, data)
    if (data === undefined) {
      return
    }

    if (typeof data !== "boolean") {
      instance.raise("boolean_invalid_type", {path})
    }
    return data
  }

  static equals(a, b) {
    return a === b
  }

}
