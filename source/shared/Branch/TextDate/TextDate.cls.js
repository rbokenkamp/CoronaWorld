const TextDate = module.exports = class TextDate extends PreCore.classes.Text {

  static validate(instance, path, meta, data) {
    meta.rule = /^\d{4}-\d{2}-\d{2}$/
    data = super.validate(instance, path, meta, data)
    if (data === undefined) {
      return
    }

    if (TextDate.dateToText(new Date(data)) !== data) {
      raise("date_invalid", {path})
    }

  }


  static dateToText(x) {
    if (x instanceof Date) {
      const {lz} = PreCore
      return "" + x.getUTCFullYear() + "-" + lz(x.getUTCMonth() + 1) + "-" + lz(x.getUTCDate())
    }
  }

  static textToDate(date) {
    const [year, month, day] = date.split("-")
    return new Date(Date.UTC(+year, +month - 1, day))
  }


  static getWeekNumber(date) {
    const d = new Date(date.valueOf()),
        dayNum = d.getUTCDay() || 7;

    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return "" + d.getUTCFullYear() + TextDate.lz(Math.ceil((((d - yearStart) / 86400000) + 1) / 7))
  }

  static getFullMonth(date) {
    return date.getUTCFullYear() + TextDate.lz(date.getUTCMonth() + 1)
  }

  static addDays(date, days) {
    if (typeof date === "string") {
      date = TextDate.textToDate(date)
    }
    return TextDate.dateToText(new Date(date.getTime() + 24 * 3600 * 1000))
  }

}
