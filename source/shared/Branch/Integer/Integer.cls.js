module.exports = class Integer extends PreCore.classes.Branch {

  static validate(instance, path, meta, data) {
    data = super.validate(instance, path, meta, data)
    if (data === undefined) {
      return
    }
    if (typeof data === "string") {
      data = +data
    }
    const {min, max} = meta
    if (typeof data !== "number" || data % 1 !== 0) {
      instance.raise("integer_invalid_type", {path})
    }
    if (min !== undefined && data < min) {
      instance.raise("integer_too_small", {path, min, data})
    }
    if (max !== undefined && data > max) {
      instance.raise("integer_too_large", {path, max, data})
    }
    return data
  }
}
