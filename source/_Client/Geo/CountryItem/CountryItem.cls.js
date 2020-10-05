module.exports = class CountryItem extends PreCore.classes.Display {

  create(params) {
    super.create(params)
    this.refresh()
  }

  refresh() {
    const {dataPath, index} = this
    const data = core.get(dataPath),
        {flag, name} = data

    this.setVars({index, flag, name})
  }


}
