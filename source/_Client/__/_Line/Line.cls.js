module.exports = class Line extends PreCore.classes.Display {

  draw() {
   let {node, parent, x1, y1, x2, y2, width, widthRelative} = this,
        {displayWidth, displayHeight} = parent

    let {} = this

    x1 = (x1 + 1) * displayWidth / 2
    y1 = (y1 + 1) * displayHeight / 2
    x2 = (x2 + 1) * displayWidth / 2
    y2 = (y2 + 1) * displayHeight / 2

    Dom.setAttributes(node, {x1, y1, x2, y2})
    Dom.style(node, {strokeWidth: `${width*parent["display"+widthRelative]}px`})

  }
}
