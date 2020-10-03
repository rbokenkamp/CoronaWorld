const shared = __dirname + "/source/shared"
const {classes} = require(__dirname + "/source" + "/PreCore")
classes.CoreError = require(shared + "/CoreError/CoreError.cls")
classes.Branch = require(shared + "/Branch/Branch.cls.js")
classes.Tree = require(shared + "/Tree/Tree.cls")
classes.Type = require(shared + "/Tree/Type/Type.cls")
classes.Test = require(shared + "/Tree/Test/Test.cls")
classes.Core = module.exports = require(shared + "/Tree/Core/Core.cls")
classes.Disc = module.exports = require(shared + "/Tree/Disc/Disc.cls")
