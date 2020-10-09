const PreCore = module.exports = {

  lz: x => x > 9 ? "" + x : "0" + x,
  mod: (value, modulus) => (value < 0 ? value + Math.ceil(-value / modulus) * modulus : value) % modulus
}

{

  const set = PreCore.set = (path, value) => {
        const parts = path.split("/"),
            last = parts.length - 1

        let current = PreCore
        for (let i = 1; i < last; i++) {
          const part = parts[i]
          current = current[part] = part in current ? current[part] : {}
        }
        current[parts[last]] = value
      },

      get = PreCore.get = path => {
        const parts = path.split("/")

        let current = PreCore
        for (let i = 1; i < parts.length; i++) {
          const part = parts[i]
          if (part in current === false) {
            return
          }
          current = current[part]
        }
        return current
      },

      isObject = PreCore.isObject = value => {
        if (value === null) {
          return false
        }
        if (typeof value !== "object") {
          return false
        }
        if (value instanceof Array || value instanceof Date || value instanceof Buffer || value instanceof RegExp) {
          return false
        }
        return true
      },
      getType = PreCore.getType = (value) => {
        if (value === null) {
          return "null"
        }
        let type = typeof (value)
        return type === "object" ? value.constructor.name : type
      },

      classes = PreCore.classes = {},

      limitKeys = PreCore.limitKeys = (params, keys) => {
        const result = {}
        for (const key in keys) {
          if (key in params) {
            result[key] = params[key]
          }
        }
        return result
      },

      merge = PreCore.merge = (a, b) => {
        const {getType} = PreCore
        b = b === undefined ? {} : b
        a = a === undefined ? {} : a
        const result = {}
        for (const key in a) {
          const valueA = a[key]
          const typeA = getType(valueA)
          if (key in b === false) {
            if (typeA === "Object") {
              result[key] = merge(valueA, {})
              continue
            }
            result[key] = valueA
            continue
          }

          const valueB = b[key]
          const typeB = getType(valueB)
          if (typeB === "Object") {
            result[key] = merge(typeA === "Object" ? valueA : {}, valueB)
            continue
          }
          result[key] = valueB
        }

        for (const key in b) {
          if (key in a === true) {
            continue
          }
          const valueB = b[key]
          const typeB = getType(valueB)
          if (typeB === "Object") {
            result[key] = merge({}, valueB)
            continue
          }
          result[key] = valueB
        }
        return result
      },

      instanceOf = PreCore.instanceOf = (typeA, typeB) => {
        if (typeA === undefined || typeB === undefined) {
          return false
        }
        typeA = typeof typeA === "string" ? typeA : getType(typeA)
        typeB = typeof typeA === "string" ? typeB : getType(typeB)
        if (typeA === typeB) {
          return true
        }

        if (typeA in classes === false || typeB in classes === false) {
          return false
        }
        return classes[typeA].prototype instanceof classes[typeB]
      },
      toString = PreCore.toString = value => {
        return '"' +
            value.replace(/\\/g, '\\\\')
                .replace(/\"/g, '\\"')
                .replace(/\n/g, "\\n")
            + '"'
      },

      toSource = PreCore.toSource = value => {
        if (value === null) {
          return "null"
        }
        if (value === undefined) {
          return "undefined"
        }
        const result = ""
        const type = getType(value)
        if (type === "Object") {
          let result = "{"
          for (const name in value) {
            result += (result === "{" ? "" : ",") + toString(name) + ":" + toSource(value[name])
          }
          result += "}"
          return result
        }
        if (type === "Array") {
          let result = "["
          for (const v of value) {
            result += (result === "[" ? "" : ",") + toSource(v)
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
          return toString(value)
        }

        return "" + value
      }


  PreCore.types = {}

  PreCore.errors = {
    type_index_missing: "Type ${key} has no index file",
    type_cls_missing: "Type ${key} has no cls file",
    error_not_exists: "Error ${name} does not exist for ${path}",
    extended_class_not_found: "extended class ${key} does not exist for ${path}",
    type_no_params: "Type ${key} has no params at ${path}",
    class_no_name: "Class ${key} must have a name",
  }
  PreCore.instances = {}

  PreCore.modules = {}

  const tokenMap = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

  PreCore.genToken = length => {
    length = length || 22
    let token = ''
    for (let i = 0; i < length; i++) {
      token += tokenMap[Math.floor(Math.random() * 62)]
    }
    return token
  }

}
