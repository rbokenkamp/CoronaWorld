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

    console.log({viewSize})
    console.log({node})
    console.log({width, height})
    console.log({offsetWidth, offsetHeight})
    console.log({viewScale})
    Dom.style(node, {
      transform: `translateX(${dx}px) translateY(${dy}px) scale(${realScale}, ${realScale})`
    })
  }

}
