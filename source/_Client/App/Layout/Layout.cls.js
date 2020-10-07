module.exports = class Layout extends PreCore.classes.Selector {

  create(params) {
    super.create(params)
    console.log("@@@", PreCore.types[this.type].instance)
  }
}
