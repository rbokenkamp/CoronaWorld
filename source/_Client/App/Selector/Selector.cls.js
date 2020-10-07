module.exports = class Selector extends PreCore.classes.Display {


  create(params) {
    params.types = ["InputListener"]
    super.create(params)
  }

  dragStart() {
    console.log("DRAG START")
    this.startValue = this.value
  }

  adjustSteps(value) {
    let {steps} = this
    const negativeFactor = value < 0 ? -1 : 1
    steps = Math.floor(steps / 2)
    return negativeFactor * Math.round(Math.abs(value) * steps) / steps
  }

  drag(dx, dy) {
    const {startValue, isHorizontal, node, marker} = this,
        {clientWidth, clientHeight} = node

    let value = startValue + (2 * (isHorizontal ? dx / clientWidth : dy / clientHeight)) / (1 - marker.size)
    value = Math.min(1, Math.max(-1, this.adjustSteps(value)))

    if (this.setBranch("value", value) !== undefined) {
      this.refresh(() => marker.draw())
    }
  }

  draw() {
    let {node, orientation, marker, value} = this,
        {parentNode} = node,
        {clientWidth, clientHeight} = parentNode,
        landscape = clientWidth > clientHeight,
        isHorizontal = this.isHorizontal = orientation !== "vertical" && (orientation === "horizontal" || landscape)

    Dom[(isHorizontal ? "add" : "remove") + "Type"](node, "Horizontal")
    Dom[(isHorizontal ? "remove" : "add") + "Type"](node, "Vertical")

    console.log({value})
  }
}
