module.exports = class Area extends PreCore.classes.Tree {
  getCoi(infections) {
    infections = infections === undefined ? this.newInfections: infections
    return infections * 365 / this.population
  }

  getCod(deaths) {
    deaths = deaths === undefined ? this.newDeaths: deaths
    return deaths * 365 / this.population
  }

  getAspect(aspect) {
    return aspect === "infections" ? this.getCoi() : this.getCod()
  }

  getNipm(infections) {
    infections = infections === undefined ? this.newInfections: infections
    return infections * 1000000/ this.population
  }

  getNdpm(deaths) {
    deaths = deaths === undefined ? this.newDeaths: deaths
    return deaths * 1000000/ this.population
  }

  getDensity() {
    const {population, area} = this
    if (population === undefined || area === undefined || area === 0) {
      return
    }
    return population/area
  }

}
