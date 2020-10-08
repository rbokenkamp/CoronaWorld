module.exports = class MapView extends PreCore.classes.Display {

  create(params) {
    params.types = ["InputListener"]
    super.create(params)
    this.paths = {}
    this.initMap()

   }

  wheel(deltaY) {
    this.setScale(deltaY > 0 ? .9 : 1.1)
  }

  setScale(scale) {
    this.scale *= scale
    this.refresh()
  }

  dragStart() {
    this.dragX = this.x
    this.dragY = this.y
  }

  drag(dx, dy) {
    const {node, dragX, dragY, scale, viewScale} = this,
        realScale = scale * viewScale,
        {clientWidth, clientHeight} = node

    this.x = dragX - dx * 2 / realScale / clientWidth
    this.y = dragY - dy * 2 / realScale / clientHeight
    this.refresh()
  }


  initShapes({key, shapes}) {
    if (shapes === undefined) {
      return
    }
    const {node, paths} = this,
        {clientWidth, clientHeight} = node,
        areaPaths = paths[key] = []

    const {length} = shapes
    for (const i in shapes) {
      const points = []
      const path = Dom.create({
            parent: node,
            tag: "path",
            attributes: {"data-event": "select", "data-key": key} //, "data-index": i}
          }),
          shape = shapes[i]
      areaPaths.push(path)
      let d = ""
      for (const point of shape) {
        const x = (point[0] + 1) * clientWidth / 2,
            y = (point[1] + 1) * clientHeight / 2
        d += `${d === "" ? "M" : " L"} ${x} ${y}`
        points.push([x, y])
      }

      Dom.setAttribute(path, "d", d)
    }
  }

  initMap() {
    const {countries} = core

    for (const key in countries) {
      this.initShapes(countries[key])
    }
  }

  draw() {
    const {node, x, y, scale} = this,
        {offsetWidth, offsetHeight} = node.parentNode,
           width = node.clientWidth,
           height = node.clientHeight,

        scaleWidth = offsetWidth / width,
        scaleHeight = offsetHeight / height,
        viewScale = this.viewScale = scaleWidth < scaleHeight ? scaleWidth : scaleHeight,
        realScale = scale * viewScale,
        dx = -x * realScale * width / 2,
        dy = -y * realScale * height / 2,
        strokeWidth = Math.min(1, 1 / realScale)

    Dom.style(node, {
      transform: `translateX(${dx}px) translateY(${dy}px) scale(${realScale}, ${realScale})`
    })

    this.setStyle(`
.MapView path {
    stroke-width: ${strokeWidth}px;
}

.MapView path.selected {
    stroke-width: ${2 * strokeWidth}px;
}
`)
  }

}
