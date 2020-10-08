module.exports = class Marker extends PreCore.classes.Display {

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
