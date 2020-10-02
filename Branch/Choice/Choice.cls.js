module.exports = class extends PreCore.classes.Branch {

  static validate(instance, path, meta, data) {
    data = super.validate(instance, path, meta, data)
    if (data === undefined) {
      return
    }

    if (typeof data !== "string") {
      instance.raise("choice_invalid_type", {path})
    }

    const {choices} = meta
    if (choices.includes(data) === false) {
      instance.raise("choice_invalid_choice", {data, path})
    }
    return data
  }

}
