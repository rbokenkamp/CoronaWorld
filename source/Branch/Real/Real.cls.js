module.exports = class Real extends PreCore.classes.Branch {

  static validate(instance, path, meta, data) {
    data = super.validate(instance, path, meta, data)
    if (data === undefined) {
      return
    }

    const {min, max} = meta
    if (typeof data !== "number") {
      instance.raise("real_invalid_type", {path})
    }
    if (min !== undefined && data < min) {
      instance.raise("real_too_small", {path, min, data})
    }
    if (max !== undefined && data > max) {
      instance.raise("real_too_large", {path, max, data})
    }
    return data
  }
}
