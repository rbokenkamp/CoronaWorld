module.exports = class CountryItem extends PreCore.classes.Display {

  create(params) {
    super.create(params)
    const {dataPath, index} = this
    const data = core.get(dataPath)

    if (data === undefined) {
      console.error(`${dataPath} returns no data`)
      return
    }
    const {flag, name} = data
    this.setVars({index, flag, name})
  }

}
