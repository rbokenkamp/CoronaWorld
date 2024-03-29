const ScoreMap = module.exports = class ScoreMap extends PreCore.classes.MapView {

  create(params) {
    super.create(params)
    const {aspectBind} = this
    this.initScores()

    this.listen({event: "set", path: aspectBind}, ({value}) => {
      this.initScores()
      this.draw()
    })

  }

  initScores() {
    const {node, aspectBind} = this,
        {countries} = core

    const stats = {}
    let maximum = 0,
        minimum = 0

    const aspect = core.get(aspectBind)
    for (const key in countries) {
      const score = countries[key].getScore(aspect)
      stats[key] = score
      maximum = score > maximum ? score : maximum
      minimum = score < minimum ? score : minimum
    }

    for (const key in stats) {
      const stat = stats[key]
      const score = stats[key] = stat === undefined ? undefined : (stat < 0 ? -stat / minimum : stat / maximum)
    }

    let i = 0
    Dom.querySelectorAll(node, "path[data-key]").forEach(child => {
      const key = Dom.getAttribute(child, "data-key")
      if (key in stats) {
        const stat = stats[key]
        const color = PostCore.colors[minimum === 0 ? "violet" : (stat < 0 ? "green" : "red")]
        const fill = stat === undefined ? "" : PostCore.getShade(color, Math.abs(stat))
        Dom.style(child, {fill})
      }
    })
  }


}


/*
    let style = ""
    for (const key in stats) {
      const score = stats[key] = stats[key] / maximum
      style += `
#d${this.id}  path[data-key=${key}] {
  fill: ${this.getShade(color, score)};
}
`
    }

    this.setStyle2(style)
    return

 */
