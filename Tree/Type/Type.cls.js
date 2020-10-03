module.exports = class Type extends PreCore.classes.Tree {
create(params) {
  console.log("+-".repeat(5), params)
  super.create(params)
}
}
