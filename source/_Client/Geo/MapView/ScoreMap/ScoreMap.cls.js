const ScoreMap = module.exports = class ScoreMap extends PreCore.classes.MapView {

  create(params) {
    super.create(params)
    this.initScores()
  }

  initScores() {
    const {node, aspectBind} = this,
        {countries} = core

    const stats = {}
    let maximum = 0

    const aspect = core.get(aspectBind)
    console.log(aspect)
    for (const key in countries) {
      const score = countries[key].getAspect(aspect)
      if (score !== undefined) {
        stats[key] = score
        maximum = score > maximum ? score : maximum
      }
    }

    for (const key in stats) {
      const score = stats[key] = stats[key] / maximum
    }

    const color = ScoreMap.colors.violet
    let i = 0
    Dom.querySelectorAll(node, "path[data-key]").forEach(child => {
      const key = Dom.getAttribute(child, "data-key")
      if (key in stats) {
        const fill = this.getShade(color, stats[key])
        Dom.style(child, {fill})
      }
    })
  }

  getShade(rgb, value, opacity) {
    opacity = opacity === undefined ? 1 : opacity
    let [r, g, b] = rgb
    r += Math.round((255 - r) * (1 - value))
    g += Math.round((255 - g) * (1 - value))
    b += Math.round((255 - b) * (1 - value))
    return `rgba(${r},${g},${b},${opacity})`
   }

}

ScoreMap.colors = {
  red: [219, 40, 40],
  orange: [242, 113, 28],
  olive: [181, 204, 24],
  green: [33, 186, 69],
  teal: [0, 181, 173],
  blue: [33, 133, 208],
  violet: [100, 53, 201],
  purple: [163, 51, 200],
  pink: [224, 57, 151],
  brown: [165, 103, 63],
  grey: [118, 118, 118],
  black: [27, 28, 29],
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
