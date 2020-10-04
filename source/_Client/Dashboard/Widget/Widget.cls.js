module.exports = class Widget extends PreCore.classes.Display {

  draw() {
    const {node, x, y, scale, viewSize, parent} = this,
        {offsetWidth, offsetHeight} = parent.node,
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
