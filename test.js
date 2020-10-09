const PreCore = require("./source/PreCore")

const s = PreCore.toSource({x: 1})

console.log(s)
const t= PreCore.fromSource(s)
console.log(t)

