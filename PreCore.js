global.PreCore = module.exports = {
  getType: (value) => {
    if (value === null) {
      return "null"
    }
    let type = typeof (value)
    return type === "object" ? value.constructor.name : type
  },
  lz: x => x > 9 ? "" + x : "0" + x,

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
      typeA = typeof typeA === "string" ? typeA : getType(typeA)
      typeB = typeof typeA === "string" ? typeB : getType(typeB)
      if (typeA === typeB) {
        return true
      }
      return classes[typeA].prototype instanceof classes[typeB]
    }


classes.CoreError = require("./CoreError/CoreError.cls")
classes.Branch = require("./Branch/Branch.cls.js")
const Data = classes.Data = require("./Data/Data.cls.js")

PreCore.types = new Data()
PreCore.errors = new Data({
  type_index_missing: "Type ${key} has no index file",
  type_cls_missing: "Type ${key} has no cls file",
  error_not_exists: "Error ${name} does not exist for ${path}",
  extended_class_not_found: "extended class ${key} does not exist for ${path}",
  type_no_params: "Type ${key} has no params at ${path}",
})
PreCore.instances = new Data()

classes.Tree = require("./Tree/Tree.cls")
classes.Type = require("./Tree/Type/Type.cls")
classes.Module = require("./Tree/Module/Module.cls")
classes.Test = require("./Tree/Test/Test.cls")
classes.Core = module.exports = require("./Tree/Core/Core.cls")
classes.Disc = module.exports = require("./Tree/Disc/Disc.cls")
