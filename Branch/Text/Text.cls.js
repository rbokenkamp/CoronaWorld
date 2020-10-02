module.exports = class extends PreCore.classes.Branch {

  static validate(instance, path, meta, data) {
    data = super.validate(instance, path, meta, data)
    if (data === undefined) {
      return
    }

    const {min, max, rule} = meta
    if (typeof data !== "string") {
      instance.raise("text_invalid_type", {path})
    }
    if (min !== undefined && data.length < min) {
      instance.raise("text_too_small", {path, min, length: data.length})
    }
    if (max !== undefined && data.length > max) {
      instance.raise("text_too_large", {path, max, length: data.length})
    }
    if (rule !== undefined && data.match(rule) === null) {
      instance.raise("text_rule_mismatch", {data, path, rule: rule.toString()})
    }
    return data
  }

}
