module.exports = class MapView extends PreCore.classes.Widget {

  create(params) {
    super.create(params)
    this.paths = {}
    this.initMap()
   }

  initMap() {
    const {node, paths} = this,
        {countries} = PreCore.data,
        {clientWidth, clientHeight} = node

    for (const alpha2 in countries) {
      const countryPaths = paths[alpha2] = [],
          {shapes} = countries[alpha2]
      for (const i in shapes) {
        const path = Dom.create({parent: node, tag: "path", attributes: {"data-key": alpha2}}),
            shape = shapes[i]
        countryPaths.push(path)
        let d = ""
        for (const point of shape) {
          const x = (point[0] + 1) * clientWidth / 2,
              y = (point[1] + 1) * clientHeight / 2
          d += `${d === "" ? "M" : " L"} ${x} ${y}`
        }

        path.setAttribute("d", d)
      }
    }
  }

  draw() {
    super.draw()
    return
      const {node, x, y, scale} = this,
        {clientWidth, clientHeight} = node,
        {width, height} = MapView,
        scaleWidth = clientWidth / width,
        scaleHeight = clientHeight / height,
        viewScale = this.viewScale = scaleWidth < scaleHeight ? scaleWidth : scaleHeight,
        realScale = scale * viewScale,
    //    dx = (clientWidth - (x + 1) * width) / 2 * realScale,
    //    dy = (clientHeight - (y + 1) * height) / 2 * realScale,
          dx=0,
          dy=0,
        strokeWidth = Math.min(1, 1 / realScale)

    console.log({clientWidth, clientHeight, viewScale})
    console.log("draw", `translateX(${dx}px) translateY(${dy}px) scale(${realScale}, ${realScale})`)
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
