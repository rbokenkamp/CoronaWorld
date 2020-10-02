global.PreCore = require("./PreCore")

PreCore.classes.CoreError = require("./CoreError/CoreError.cls")
PreCore.classes.Branch = require("./Branch/Branch.cls")
PreCore.classes.Tree = require("./Tree/Tree.cls")
PreCore.classes.Test = require("./Tree/Test/Test.cls")
PreCore.classes.Collection = require("./Tree/Collection/Collection.cls")
PreCore.classes.Core = module.exports = require("./Tree/Core/Core.cls")
