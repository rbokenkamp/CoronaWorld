module.exports = class Layout extends PreCore.classes.Display {

  create(params) {
    super.create(params)
  }

  build(params) {
    super.build(params)
    this.signal("draw")
  }


  draw() {
    const {node, marker} = this,
        {clientWidth, clientHeight} = node,
        landscape = innerWidth > innerHeight

    Dom[(landscape ? "add" : "remove") + "Type"](node, "Landscape")
    return

    console.log(marker)
    if (landscape) {
      marker.set({x1: 0, y1: -1, x2: 0, y2: 1})
    }
    else {
      marker.set({x1: -1, y1: 0, x2: 1, y2: 0})
    }

    this.displayWidth = clientWidth
    this.displayHeight = clientHeight
    this.landscape = clientWidth > clientHeight
  }

}
