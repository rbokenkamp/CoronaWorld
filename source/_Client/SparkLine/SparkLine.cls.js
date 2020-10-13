const {round, floor} = Math
const SparkLine = module.exports = class SparkLine extends PreCore.classes.Display {

  create(params) {
    params.tag = "svg"
    super.create(params)
    this.refresh()
  }

  refresh() {
    let {node, reduce, data} = this,
        line = this.line = this.line || Dom.create({parent: node, tag: "path"}),
        {clientWidth, clientHeight} = node

    if (data === undefined || data.length < 2) {
      return
    }

    data = SparkLine.reduce(data, reduce)

    const min = Math.min.apply(null, data),
        max = Math.max.apply(null, data),
        deltaX = clientWidth / (data.length - 1)

    let d = ""
    for (let i in data) {
      i = +i
      const x = round(i * deltaX),
          y = max === min ? 0 : round(clientHeight - (data[i] - min) / (max - min) * clientHeight)
      d += `${i === 0 ? "M" : " L"} ${x} ${y}`

    }

    Dom.setAttributes(line, {d})
  }

  static reduce(points, n) {
    n = n || 50
    if (points.length <= n) {
      return points
    }
    const result = [],
        {length} = points,
        half = floor(length / 2)
    for (let i = 0; i < half; i++) {
      result.push((points[i * 2] + points[i * 2 + 1]) / 2)
    }
    if (length % 2 === 1) {
      result.push(points[length - 1])
    }

    if (result.length > n) {
      return this.reduce(result, n)
    }
    return result
  }


}

