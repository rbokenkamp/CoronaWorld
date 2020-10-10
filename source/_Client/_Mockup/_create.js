const [_,path, type, extend] = process.argv
const home = __dirname
const typePath = home+"/"+type
const fs = require("fs")

fs.mkdirSync(typePath)
fs.writeFileSync(typePath+"/"+type+".cls.js", `module.exports = class ${type} extends PreCore.classes.${extend} {
}
`)
fs.writeFileSync(typePath+"/"+type+".instance.js", `module.exports = {
}
`)
fs.writeFileSync(typePath+"/"+type+".index.js", `module.exports = {
  type: "Type",
  extend: "${extend}",
}
`)

fs.writeFileSync(typePath+"/"+type+".template.html", "")
fs.writeFileSync(typePath+"/"+type+".style.scss", `@import "colors";

.${type} {
}
`)
