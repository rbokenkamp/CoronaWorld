const home = __dirname+"/source"
const {classes} = require(home+"/PreCore")
classes.CoreError = require(home+"/CoreError/CoreError.cls")
classes.Branch = require(home+"/Branch/Branch.cls.js")
classes.Tree = require(home+"/Tree/Tree.cls")
classes.Type = require(home+"/Tree/Type/Type.cls")
classes.Test = require(home+"/Tree/Test/Test.cls")
classes.Core = module.exports = require(home+"/Tree/Core/Core.cls")
classes.Disc = module.exports = require(home+"/Tree/Disc/Disc.cls")
