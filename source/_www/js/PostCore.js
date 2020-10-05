const PostCore = module.exports = {},
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
    }


