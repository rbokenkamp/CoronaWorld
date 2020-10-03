const Rule = module.exports = class Rule extends PreCore.classes.Branch {

  static validate(instance, path, meta, data) {
    data = super.validate(instance, path, meta, data)
    if (data === undefined) {
      return
    }

    if (PreCore.typeof(data) !== "RegExp") {
      instance.raise("rule_invalid_type", {path})
    }
    return data
  }

  static equals(a, b) {
    return a.toString() === b.toString()
  }

}
