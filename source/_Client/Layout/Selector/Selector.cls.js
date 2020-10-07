module.exports = class Selector extends PreCore.classes.Display {


  create(params) {
    params.types = ["InputListener"]
    super.create(params)
  }

  dragStart() {
    this.startValue = this.value
  }

  adjustSteps(value) {
    const {steps} = this
    const negativeFactor = value < 0 ? -1 : 1
    return negativeFactor * Math.round(Math.abs(value) * steps) / steps
  }

  drag(dx, dy) {
    const {startValue, isHorizontal, displayWidth, displayHeight, marker} = this
    let value = startValue + 2 * (isHorizontal ? dx / displayWidth : dy / displayHeight)
    value = Math.min(1, Math.max(-1, this.adjustSteps(value)))
    this.setBranch("value", value)
    this.refresh(() => marker.draw())
  }

  draw() {
    const {node, orientation, marker, value} = this,
        {parentNode} = node,
        {clientWidth, clientHeight} = parentNode,
        landscape = clientWidth > clientHeight,
        isHorizontal = this.isHorizontal = orientation !== "vertical" && (orientation === "horizontal" || landscape)

    Dom[(isHorizontal ? "add" : "remove") + "Type"](node, "Horizontal")
    Dom[(isHorizontal ? "remove" : "add") + "Type"](node, "Vertical")
    Dom[(value === 0 ? "add" : "remove") + "Type"](marker.node, "Zero")

    this.displayWidth = node.clientWidth
    this.displayHeight = node.clientHeight

    marker.set({
      x1: isHorizontal ? value : -1,
      y1: isHorizontal ? -1 : value,
      x2: isHorizontal ? value : 1,
      y2: isHorizontal ? 1 : value,
      widthRelative: isHorizontal ? "Width" : "Height",
    })

  }
}
