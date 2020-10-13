module.exports = class CountryItem extends PreCore.classes.Display {

  create(params) {
    super.create(params)
    this.setBranch("trend", {
      type: "SparkLine",
      node: this.node.querySelector("svg"),
    })

    this.refresh()
  }

  refresh() {
    const {index, dataPath, trend} = this,
        data = core.get(dataPath)

    if (data === undefined) {
      console.error(`${dataPath} returns no data`)
      return
    }

    const {aspect} = this.parent.parent,
        {flag, name} = data,
        percentage = aspect === "infections"

    let score = data.getScore(aspect)
    score = score === undefined ? "-" : PostCore.formatNumber(percentage ? score * 100 : score) + (percentage ? "%" : "")
    this.setVars({index, flag, name, score})
    trend.data = data.stats //[aspect]
    trend.refresh()
  }

}
