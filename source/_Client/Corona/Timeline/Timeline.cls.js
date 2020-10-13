module.exports = class Timeline extends PreCore.classes.Tree {
  create(params) {
    super.create(params)
    this.getBoundaries()
    this.getTimeline()
  }

  getBoundaries() {
    const {dates} = this
    let start = "9999-12-31",
        end = "2000-01-01"


    for (const key in dates) {
      for (const date in dates[key]) {
        start = date < start ? date : start
        end = date > end ? date : end
      }
    }
    for (const key in dates) {
      for (const date in dates[key]) {
        start = date < start ? date : start
        end = date > end ? date : end
      }
    }

    this.start = start
    this.end = end
  }

  getAverage(values) {
    let sum = 0
    for (const value of values) {
      sum += value
    }
    return sum / values.length
  }

  getTimeline() {
    const {addDays} = PreCore.classes.TextDate,
        {start, end, dates} = this

    const allDates = this.allDates = {}
    let current = start
    while (current <= end) {
      allDates[current] = [0, 0]
      current = addDays(current, 1)
    }

    for (const key in dates) {
      this.processCountry(key, dates[key], 7)
      //    dates[key] = Object.assign({}, allDates, dates[key])
    }

  }

  processCountry(key, timeline) {
    let {daysAverage, parent, allDates} = this,
        {countries} = parent,
        country = countries[key],
        infectionsDays = [],
        deathsDays = [],
        countryTimeline = []

    if (country === undefined) {
      return
    }
    let lastInfections, lastDeaths, previousInfections, previousDeaths

    for (const date in allDates) {
      previousInfections = lastInfections
      previousDeaths = lastDeaths
      const [infections, deaths] = timeline[date] || allDates[date]


      infectionsDays.push(infections)
      deathsDays.push(deaths)
      countryTimeline.push(infections)

      if (infectionsDays.length > daysAverage) {
        infectionsDays.shift()
        deathsDays.shift()
      }


      lastInfections = this.getAverage(infectionsDays)
      lastDeaths = this.getAverage(deathsDays)

    }


    country.newInfections = lastInfections
    country.newDeaths = lastDeaths
    country.deltaInfections = lastInfections - previousInfections
    country.deltaDeaths = lastDeaths - previousDeaths
    country.stats = countryTimeline
  }


}
