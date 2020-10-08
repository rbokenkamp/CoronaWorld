module.exports = class Marker extends PreCore.classes.Display {

  create(params) {
    params.types = ["InputListener"]
    super.create(params)
  }

  dragStart() {
    this.startValue = this.parent.value
  }

  adjustSteps(value) {
    const {parent} = this
    let {steps} = parent
    const negativeFactor = value < 0 ? -1 : 1
    steps = Math.floor(steps / 2)
    return negativeFactor * Math.round(Math.abs(value) * steps) / steps
  }

  drag(dx, dy) {
    const {startValue, node, parent, size} = this,
        {isHorizontal} = parent,
        {clientWidth, clientHeight} = parent.node

    let value = startValue + (2 * (isHorizontal ? dx / clientWidth : dy / clientHeight)) / (1 - size)
    value = Math.min(1, Math.max(-1, this.adjustSteps(value)))

    parent.setBranch("value", value)
  }

  draw() {
    const {parent, node, size} = this,
        {isHorizontal} = parent

    if (isHorizontal) {
      Dom.style(node, {width: `${parent.node.clientWidth * size}px`, height: "100%"})
    } else {
      Dom.style(node, {width: "100%", height: `${parent.node.clientHeight * size}px`})
    }
  }
}
