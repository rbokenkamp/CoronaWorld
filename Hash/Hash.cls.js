module.exports = class extends PreCore.classes.Tree {

  static validate(instance, path, meta, data) {
    data = super.validate(instance, path, meta, data)
    if (data === undefined) {
      return
    }

    if (PreCore.getType(date)!== "Object") {
      instance.raise("hash_invalid_type", {path})
    }
    return Tree.validate(instance, path, meta.branches, data)
  }


}
