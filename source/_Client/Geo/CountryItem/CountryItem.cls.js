module.exports = class CountryItem extends PreCore.classes.Display {

  create(params) {
    super.create(params)
    this.refresh()
  }

  refresh() {
    const {index, dataPath} = this,
        data = core.get(dataPath)

    if (data === undefined) {
      console.error(`${dataPath} returns no data`)
      return
    }

    const {flag, name, population} = data
    this.setVars({index, flag, name, population: population === undefined ? "-" : PostCore.formatNumber(population)})

  }

}
