const Meta = module.exports = class Meta extends PreCore.classes.Branch {

  static validate(instance, path, meta, data) {
    const {classes, types} = PreCore,
        {Branch, Tree} = classes
    data = Branch.validate(instance, path, meta, data)

    if (data === undefined) {
      return
    }


    if (typeof data === "string") {
      data = {type: data}
    }

    const {type} = data

    if (type in classes === false) {
      instance.raise("type_not_exists", {path, type})
    }

    return Tree.validate(instance, path, types[type].metas, data)
  }

}
