const PreCoreClass = module.exports = class {

  constructor(types, required) {
    this.classes = {}
    this.types = types || {}
    this.required = required
    this.errors = {
      error_not_exists: "Error ${name} does not exist for ${path}",
      extended_class_not_found: "extended class ${key} does not exist for ${path}",
      type_no_params: "Type ${key} has no params at ${path}",
    }

    this.instances = {}

    /* this.core = undefined */
  }


  limitText(s, length) {
    return s.length > length ? s.substr(0, length - 2) + ".." : s
  }


  toDateString(x) {
    return "" + x.getUTCFullYear() + "-" + this.lz(x.getUTCMonth() + 1) + "-" + this.lz(x.getUTCDate())
  }

  formatDate(x) {
    if (typeof x === "string") {
      const [year, month, day] = x.split("-")
      return "" + (+month) + "-" + (+day) + "-" + year
    }
    return "" + (x.getUTCMonth() + 1) + "-" + x.getUTCDate() + "-" + x.getUTCFullYear()
  }

  formatNumber(x) {
    if (x === 0) {
      return "0"
    }

    let log = Math.log(x) / Math.log(10)
    if (log > 0) {
      const level = Math.floor(log / 3)
      x = x / Math.pow(10, level * 3)
      return x.toFixed(x >= 10 ? 0 : 1) + PreCoreClass.levels[level]

    }

    log = Math.floor(log) - 1

    const y = Math.pow(10, -log)
    return Math.round(x * y) / y
  }

  set(path, value) {
    const parts = path.split("/"),
        last = parts.length - 1

    let current = this
    for (let i = 1; i < last; i++) {
      const part = parts[i]
      current = current[part] = part in current ? current[part] : {}
    }
    current[parts[last]] = value
  }

  get(path) {
    const parts = path.split("/")

    let current = this
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i]
      if (part in current === false) {
        return
      }
      current = current[part]
    }
    return current
  }

  lz(x) {
    return x > 9 ? "" + x : "0" + x
  }

  instanceof(a, b) {
    if (a === b) {
      return true
    }
    const {classes} = this
    return classes[a].prototype instanceof classes[b]
  }

  typeof(value) {
    if (value === null) {
      return "null"
    }
    let type = typeof (value)
    return type === "object" ? value.constructor.name : type
  }

  merge(a, b) {
    b = b === undefined ? {} : b
    a = a === undefined ? {} : a
    const result = {}
    for (const key in a) {
      const valueA = a[key]
      const typeA = this.typeof(valueA)
      if (key in b === false) {
        if (typeA === "Object") {
          result[key] = this.merge(valueA, {})
          continue
        }
        result[key] = valueA
        continue
      }

      const valueB = b[key]
      const typeB = this.typeof(valueB)
      if (typeB === "Object") {
        result[key] = this.merge(typeA === "Object" ? valueA : {}, valueB)
        continue
      }
      result[key] = valueB
    }

    for (const key in b) {
      if (key in a === true) {
        continue
      }
      const valueB = b[key]
      const typeB = typeof valueB
      if (typeB === "Object") {
        result[key] = this.merge({}, valueB)
        continue
      }
      result[key] = valueB
    }
    return result
  }

  toString2(value) {
    return '"' +
        value.replace(/\\/g, '\\\\')
            .replace(/\"/g, '\\"')
            .replace(/\n/g, "\\n")
        + '"'
  }

  toSource(value) {
    if (value === null) {
      return "null"
    }
    if (value === undefined) {
      return "undefined"
    }
    const result = ""
    const type = this.typeof(value)
    if (type === "Object") {
      let result = "{"
      for (const name in value) {
        result += (result === "{" ? "" : ",") + this.toString2(name) + ":" + this.toSource(value[name])
      }
      result += "}"
      return result
    }
    if (type === "Array") {
      let result = "["
      for (const v of value) {
        result += (result === "[" ? "" : ",") + this.toSource(v)
      }
      return result + "]"
    }
    if (type === "Date") {
      return "new Date(" + value.getTime() + ")"
    }
    if (type === "RegExp" || type === "function") {
      return value.toString()
    }
    if (type === "Buffer") {
      return "Buffer.from(\"" + value.toString("hex") + "\", \"hex\")"
    }

    if (type === "string") {
      return this.toString2(value)
    }

    return "" + value
  }


  transform(params) {
    const result = {}
    for (const key in params) {
      const value = params[key]
      if (typeof value === "object") {
        continue
      }
      result[key] = value
    }
    return JSON.stringify(result)
  }

  log(params) {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/log")
    xhr.send(this.transform(params))
  }


}


PreCoreClass.levels = {
  0: "",
  1: "K",
  2: "M",
  3: "B",
  4: "T",
}

