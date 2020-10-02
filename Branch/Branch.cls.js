module.exports = class {

  raise(name, params) {
    const {errors, classes} = PreCore

    if (name in errors === false) {
      this.raise("error_not_exists", {name, path: params.path})
    }

    if (params.path === "") {
      params.path = "<core>"
    }
    const message = this.getErrorMessage(errors[name], params)

    throw new classes.CoreError(message, name, params)
  }

  getErrorMessage(template, params) {
    const script = (params ? "const {" + Object.keys(params) + "} = params; " : "") + "result = `" + template + "`"

    try {
      let result
      eval(script)
      return result
    } catch (err) {
      console.log("@@@@", "INVALID PARAMS", "@@@@")
      console.log("template", template)
      console.log("params", params)
      console.log("script", script)
      console.log("@@@@", "INVALID PARAMS", "@@@@")
      throw err
    }
  }

  static validate(instance, path, meta, data) {
    const {required, defaultValue} = meta

    data = data === undefined ? defaultValue : data
    if (data === undefined && required) {
      instance.raise("branch_required", {path})
    }
    return data
  }

  static equals(a, b) {
    return a === b
  }



}
