module.exports = class Path extends PreCore.classes.Text {

  static validate(instance, path, meta, data) {
    meta.rule = /^([\/][a-zA-Z0-9_-]*)*$/
    return super.validate(instance, path, meta, data)
  }

}
