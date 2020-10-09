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

    const {aspect} = this.parent.parent,
        score = data.getScore(aspect),
        {flag, name} = data
    this.setVars({index, flag, name, score: score === undefined ? "-" : PostCore.formatNumber(score)})
  }

}
