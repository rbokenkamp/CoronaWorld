module.exports = class Selector extends PreCore.classes.Display {


  create(params) {
    super.create(params)
  }

  draw() {
    const {node, orientation, marker} = this,
        {parentNode} = node,
        {clientWidth, clientHeight} = parentNode,
        landscape = clientWidth > clientHeight,
        isHorizontal = orientation !== "vertical" && (orientation === "horizontal" || landscape)

    Dom[(isHorizontal ? "add" : "remove") + "Type"](node, "Horizontal")
    Dom[(isHorizontal ? "remove" : "add") + "Type"](node, "Vertical")

    this.displayWidth = node.clientWidth
    this.displayHeight = node.clientHeight

    const {displayWidth, displayHeight} = this
    this.marker.set({
      x1: isHorizontal ?  0 : -1,
      y1: isHorizontal ? -1 : 0,
      x2: isHorizontal ? 0 : 1,
      y2: isHorizontal ? 1 : 0,
      widthRelative: isHorizontal ? "Width" : "Height",
    })

  }
}
