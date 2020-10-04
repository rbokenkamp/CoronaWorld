module.exports = class DataValue extends PreCore.classes.Display {

create(params) {
  console.log("@@@ Value @@@", params)
  super.create(params)
  Dom.set(this.node, "hello")
}
}
