module.exports = class Area extends PreCore.classes.Tree {
  getDensity() {
    const {population, area} = this
    if (population === undefined || area === undefined || area === 0) {
      return 0
    }
    return population / area
  }

  getInfections() {
    const {population, newInfections} = this
    if (population === undefined || newInfections === undefined || population === 0) {
      return 0
    }
    return newInfections / population*365

  }

  getDeltaInfections() {
    const {population, deltaInfections} = this
    if (population === undefined || deltaInfections === undefined || population === 0) {
      return undefined
    }
    return deltaInfections / population*365

  }

  getScore(aspect) {
    if (aspect === "density") {
      return this.getDensity()
    }
    if (aspect === "infections") {
       return this.getInfections()
    }
    if (aspect === "deltaInfections") {
      return this.getDeltaInfections()
    }
    return this[aspect]
  }

}
