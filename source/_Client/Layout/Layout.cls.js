module.exports = class Layout extends PreCore.classes.Display {

  create(params) {
    console.log("params", params)
    super.create(params)
  }

  draw() {
    console.log("")
    const {core} = this
  }
}
