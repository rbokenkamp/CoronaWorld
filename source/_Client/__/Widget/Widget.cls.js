module.exports = class Widget extends PreCore.classes.Display {


  screenToWidget(x, y) {
    const {node, scale, viewScale} = this,
        {offsetWidth, offsetHeight} = node.parentNode,
        {clientWidth, clientHeight} = node,
        realScale = scale * viewScale,
        startX = this.x / 2 * offsetWidth + (offsetWidth - clientWidth * realScale) / 2,
        widgetX = (x - startX) / realScale,

        startY = this.y / 2 * offsetHeight + (offsetHeight - clientHeight * realScale) / 2,
        widgetY = (y - startY) / realScale

    if (widgetX < 0 || widgetX > clientWidth) {
      return
    }
    if (widgetY < 0 || widgetY > clientHeight) {
      return
    }
    return [widgetX, widgetY]
  }

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
        dx = (offsetWidth * (1 + x) - width) *realScale/ 2,
        dy = (offsetHeight * (1 + y) - height) *realScale/ 2


    Dom.style(node, {
      transform: `translateX(${dx}px) translateY(${dy}px) scale(${realScale}, ${realScale})`
    })

  }

}
