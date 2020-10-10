module.exports = class Area extends PreCore.classes.Tree {
  getDensity() {
    const {population, area} = this
    if (population === undefined || area === undefined || area === 0) {
      return undefined
    }
    return population / area
  }

  getScore(aspect) {
    if (aspect === "density") {
      return this.getDensity()
    }
    return this[aspect]
  }

}
