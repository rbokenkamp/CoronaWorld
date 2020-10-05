module.exports = class Widget extends PreCore.classes.Display {

  draw() {
    // give inner content a chance to be drawn first
    if (this.drawn !== true) {
      this.drawn = true
      setTimeout(() => this.draw())
      return
    }
    const {node, x, scale, viewSize, y} = this,
        parentNode = node.parentNode,
        {offsetWidth, offsetHeight} = parentNode,
        width = node.clientWidth,
        height = node.clientHeight,
        scaleWidth = offsetWidth / width * viewSize,
        scaleHeight = offsetHeight / height * viewSize,
        viewScale = this.viewScale = scaleWidth < scaleHeight ? scaleWidth : scaleHeight,
        realScale = scale * viewScale,
        dx = (offsetWidth * (1 + x) - width) / 2,
        dy = (offsetHeight * (1 + y) - height) / 2

    Dom.style(node, {
      transform: `translateX(${dx}px) translateY(${dy}px) scale(${realScale}, ${realScale})`
    })
  }

}
