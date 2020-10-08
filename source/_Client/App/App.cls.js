module.exports = class App extends PreCore.classes.Display {

  build(params) {
    super.build(params)
    this.signal("draw")
  }

  remote(params) {
    console.log("REMOTE", params)
    this.branch({key: "qr", type: "QrGenerator"})
  }

}
