module.exports = class MapView extends PreCore.classes.Widget {

  create(params) {
    params.types = ["InputListener"]
    super.create(params)
    const {bindPath} = this
    this.paths = {}
    this.initMap()
    if (bindPath) {
      const key = core.get(bindPath)
      this.setValue(key, true)
      this.listen({event: "set", path: bindPath}, ({value}) => {
        this.setValue(value)
      })
    }
  }

  select({key}) {
    const {bindPath} = this
    if (bindPath) {
      return core.set(key, bindPath)
    }
    this.setValue(key)
  }
  getPaths(key) {
    const {countries} = core,
        {paths} = this

    return paths[key]

/*
    let result = []
    for (const alpha2 of core[selectorType][key].countries) {
      result = result.concat(paths[alpha2])
    }
    return result

 */
  }

  setValue(value, init) {
    const {node} = this
    if (value === this.value && !init) {
      return
    }
    node.querySelectorAll(".selected").forEach(node => node.remove())
    if (value === undefined) {
      this.value = undefined
      if (init) {
        return this.draw()
      }
      return this.transition({x: 0, y: 0, scale: 1, duration: 500, steps: 5})
    }
    this.value = value
    const country = core.countries[value]
    if (country === undefined) {
      this.raise("map_value_unknown", {path: this.path, value})
    }
    const {location} = country
    if (location === undefined) {
      return console.error(`Country ${country.name} does not have a location`)
    }

    this.value = value
    const paths = this.getPaths(value) //this.paths[key]

    for (const path of paths) {
      const x = Dom.create({
        parent: node, tag: "path", attributes: {"data-key": value, d: Dom.getAttribute(path, "d")}, types: ["selected"]
      })
    }
    if (init) {
      return this.draw()
    }
    this.transition({x: location[0], y: location[1], scale: 5, duration: 500, steps: 5})
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
