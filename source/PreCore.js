global.PreCore = module.exports = {
  lz: x => x > 9 ? "" + x : "0" + x,

},
    getType = PreCore.getType = (value) => {
      if (value === null) {
        return "null"
      }
      let type = typeof (value)
      return type === "object" ? value.constructor.name : type
    },

    classes = PreCore.classes = {},

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
      const type = this.typeof(value)
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
