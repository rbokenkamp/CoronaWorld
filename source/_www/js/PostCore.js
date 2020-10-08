const PostCore = module.exports = {}
{
  const levels = {
        0: "",
        1: "K",
        2: "M",
        3: "B",
        4: "T",
      },
      {abs, sqrt, floor, pow, round, log} = Math,
      transform = PostCore.transform = params => {
        const result = {}
        for (const key in params) {
          const value = params[key]
          if (typeof value === "object") {
            continue
          }
          result[key] = value
        }
        return JSON.stringify(result)
      },
      _log = PostCore.log = params => {
        const xhr = new XMLHttpRequest()
        xhr.open("POST", "/log")
        xhr.send(transform(params))
      },
      formatNumber = PostCore.formatNumber = x => {
        if (x === undefined) {
          return ""
        }
        if (x === 0) {
          return "0"
        }

        let lg = log(x) / log(10)
        if (lg > 0) {
          const level = Math.floor(lg / 3)
          x = x / Math.pow(10, level * 3)
          return x.toFixed(x >= 10 ? 0 : 1) + levels[level]

        }

        lg =floor(lg) - 1

        const y = pow(10, -lg)
        return round(x * y) / y
      },
      distanceToLine = PostCore.distanceToLine = ([x0, y0], [x1, y1], [x2, y2]) => {
        const dx = x2 - x1,
            dy = y2 - y1
        return abs(x0 * dy - y0 * dx + x2 * y1 - y2 * x1) / sqrt(dx * dx + dy * dy)
      }

}
