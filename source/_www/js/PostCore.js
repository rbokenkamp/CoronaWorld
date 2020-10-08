const PostCore = module.exports = {}
{
  const levels = {
        0: "",
        1: "K",
        2: "M",
        3: "B",
        4: "T",
      },
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
      log = PostCore.log = params => {
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

        let log = Math.log(x) / Math.log(10)
        if (log > 0) {
          const level = Math.floor(log / 3)
          x = x / Math.pow(10, level * 3)
          return x.toFixed(x >= 10 ? 0 : 1) + levels[level]

        }

        log = Math.floor(log) - 1

        const y = Math.pow(10, -log)
        return Math.round(x * y) / y
      }
}
