const shared = __dirname + "/source/shared",
    {classes} = global.PreCore = require(__dirname + "/source" + "/PreCore")
classes.CoreError = require(shared + "/CoreError/CoreError.cls")
classes.Branch = require(shared + "/Branch/Branch.cls.js")
classes.Tree = require(shared + "/Tree/Tree.cls")
classes.Type = require(shared + "/Tree/Type/Type.cls")
// classes.Test = require(shared + "/Tree/Test/Test.cls")
classes.EventHandler = module.exports = require(shared + "/Tree/Core/EventHandler/EventHandler.cls")
classes.Core = require(shared + "/Tree/Core/Core.cls")
classes.Disc = require(shared + "/Tree/Core/Disc/Disc.cls")
classes.Server = require("./source/Server/Server.cls.js"),

module.exports = classes
