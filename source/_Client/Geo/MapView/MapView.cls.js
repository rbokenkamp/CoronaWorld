const MapView = module.exports = class MapView extends PreCore.classes.Widget {

  create(params) {
    console.log("CREATE", params)
    super.create(params)
    this.paths = {}
    this.initMap()
   }

  initMap() {
    const {node, paths} = this,
        {countries} = PreCore.data,
        {width, height} = MapView
//        svg = this.svg = Dom.create({parent: node, tag: "svg"})
    Dom.setAttributes(node, {width, height})

    for (const alpha2 in countries) {
      const countryPaths = paths[alpha2] = [],
          {shapes} = countries[alpha2]
      for (const i in shapes) {
        const path = Dom.create({parent: node, tag: "path", attributes: {"data-key": alpha2}}),
            shape = shapes[i]
        countryPaths.push(path)
        let d = ""
        for (const point of shape) {
          const x = (point[0] + 1) * width / 2,
              y = (point[1] + 1) * height / 2
          d += `${d === "" ? "M" : " L"} ${x} ${y}`
        }

        path.setAttribute("d", d)
      }
    }
  }

  draw() {
    return
    const {node, x, y, scale} = this,
        {offsetWidth, offsetHeight} = node,
        {width, height} = Map,
        scaleWidth = offsetWidth / width,
        scaleHeight = offsetHeight / height,
        viewScale = this.viewScale = scaleWidth < scaleHeight ? scaleWidth : scaleHeight,
        realScale = scale * viewScale,
        dx = (offsetWidth - (x + 1) * width) / 2 * realScale,
        dy = (offsetHeight - (y + 1) * height) / 2 * realScale,
        strokeWidth = Math.min(1, 1 / realScale)

    Dom.style(node, {
      transform: `translateX(${dx}px) translateY(${dy}px) scale(${realScale}, ${realScale})`
    })

    this.setStyle(`
.Map path {
    stroke-width: ${strokeWidth}px;
}

.Map path.selected {
    stroke-width: ${2 * strokeWidth}px;
}
`)
  }


}

MapView.width = 2058
MapView.height = 1036
