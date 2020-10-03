module.exports = class DateString extends PreCore.classes.Text {

  static validate(instance, path, meta, data) {
    meta.rule = /^\d{4}-\d{2}-\d{2}$/
    data = super.validate(instance, path, meta, data)
    if (data === undefined) {
      return
    }

    if (this.toDate(new Date(data)) !== data) {
      raise("date_invalid", {path})
    }

  }


  static toDate(x) {
    if (x instanceof Date) {
      const {lz} = PreCore
      return "" + x.getUTCFullYear() + "-" + lz(x.getUTCMonth() + 1) + "-" + lz(x.getUTCDate())
    }
  }

}
