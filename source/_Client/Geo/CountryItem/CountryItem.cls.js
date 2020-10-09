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

    const {flag, name, population, area} = data
    const density = data.getDensity()
    this.setVars({index, flag, name, population: density === undefined ? "-" : PostCore.formatNumber(density)})
   // this.setVars({index, flag, name, population: area === undefined ? "-" : PostCore.formatNumber(area)})
    //  this.setVars({index, flag, name, population: population === undefined ? "-" : PostCore.formatNumber(population)})

  }

}
