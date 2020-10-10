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

        lg = floor(lg) - 1

        const y = pow(10, -lg)
        return round(x * y) / y
      },
      distanceToLine = PostCore.distanceToLine = ([x0, y0], [x1, y1], [x2, y2]) => {
        const dx = x2 - x1,
            dy = y2 - y1
        return abs(x0 * dy - y0 * dx + x2 * y1 - y2 * x1) / sqrt(dx * dx + dy * dy)
      },
      getArea = PostCore.getArea = points => {
        let result = 0
        const {length} = points
        for (let i in points) {
          i = +i
          const [x1, y1] = points[i],
              [x2, y2] = points[i < length - 1 ? i + 1 : 0]
          result += x1 * y2 - y1 * x2
        }
        return abs(result / 2)
      },
      colors = PostCore.colors = {
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
      },
      getShade = PostCore.getShade = (rgb, value, opacity) => {
        opacity = opacity === undefined ? 1 : opacity
        let [r, g, b] = rgb
        r += Math.round((255 - r) * (1 - value))
        g += Math.round((255 - g) * (1 - value))
        b += Math.round((255 - b) * (1 - value))
        return `rgba(${r},${g},${b},${opacity})`
      }


}
