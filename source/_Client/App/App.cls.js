module.exports = class App extends PreCore.classes.Display {

  build(params) {

    super.build(params)
    this.signal("draw")
  }

}
