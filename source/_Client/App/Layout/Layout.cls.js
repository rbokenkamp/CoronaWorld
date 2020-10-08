module.exports = class Layout extends PreCore.classes.Selector {


  adjustMarker() {
  }

  draw() {
    super.draw()
    return
    const {isHorizontal, node, marker, value} = this,
        {clientWidth, clientHeight} = node,
        {size} = marker,
        markerNode = marker.node,
        bottom = node.querySelector(".Layout-List")

    const width = (1 - (value + 1) / 2) * clientWidth - size * clientWidth / 2 + 1
    Dom.style(bottom, {
      width: `${width}px`
    })
    console.log(size)
  }
}
