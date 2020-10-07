module.exports = class Marker extends PreCore.classes.Display {

  draw() {
    const {parent, node, size} = this,
        {parentNode} = node,
        {clientWidth, clientHeight} = parentNode

    let {isHorizontal, value} = parent
    Dom[(value === 0 ? "add" : "remove") + "Type"](node, "Zero")
    Dom[(value === -1 || value === 1 ? "add" : "remove") + "Type"](node, "Boundary")

     value *= (1 - size) // adjust for boundary display of marker

    const width = isHorizontal ? "" + size * clientWidth : clientWidth,
        height = isHorizontal ? clientHeight : "" + size * clientHeight,
        top = isHorizontal ? 0 : `${-height / 2 + (1 + value) * clientHeight / 2}px`,
        left = isHorizontal ? `${-width / 2 + (1 + value) * clientWidth / 2}px` : 0


    Dom.style(node, {
      width: `${width}px`,
      height: `${height}px`,
      top,
      left,
    })

  }
}
