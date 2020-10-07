
module.exports = class MapView extends PreCore.classes.Widget {

  create(params) {
    let location
   // location = sessionStorage.getItem("location")
    if (location) {
      console.log(location)
      Object.assign(params, JSON.parse(location))
    }

    super.create(params)
    this.paths = {}
    this.initMap()
    this.listen({event: "menu-move"}, () => {
      this.draw()
    })

    window.onwheel = ({deltaY}) => {
      this.setScale(deltaY > 0 ? .9 : 1.1)
    }

    // const {location} = core.countries.nl,
    //     [x, y] = location

    //   this.x = x
    //   this.y = -y
//    console.log(location)
  }

  dragStart() {
    this.dragX = this.x
    this.dragY = this.y
  }

  setScale(scale) {
    const previousScale = this.scale
    this.scale *= scale
    this.refresh()
    //  PostCore.log({previousScale, scale, nextScale: this.scale, totalScale})
  }

  drag(dx, dy) {
    const {node, dragX, dragY} = this
    const {parentNode} = node
    const {offsetWidth, offsetHeight} = parentNode
    this.x = dragX + (dx * 2 / offsetWidth)
    this.y = dragY + (dy * 2 / offsetHeight)
    this.refresh()
  }

  area(points) {
    let result = 0
    const {length} = points
    for (let i in points) {
      i = +i
      const [x1, y1] = points[i],
          [x2, y2] = points[i < length - 1 ? i + 1 : 0]
      result += x1 * y2 - y1 * x2
    }
    return Math.abs(result / 2)
  }

  distance(v, w) {
    return Math.sqrt(Math.pow(v[0] - w[0], 2) + Math.pow(v[1] - w[1], 2))
  }

  distanceToLine2(p, a, b) {
    const l2 = this.distance(a, b)
    if (l2 === 0) return this.distance(p, a)
    var t = ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / l2
    t = Math.max(0, Math.min(1, t));
    return this.distance(p, [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])])
  }

  distanceToLine([x0, y0], [x1, y1], [x2, y2]) {
    const dx = x2 - x1,
        dy = y2 - y1
    return Math.abs(x0 * dy - y0 * dx + x2 * y1 - y2 * x1) / Math.sqrt(dx * dx + dy * dy)
  }


  /*
  distanceToLine(p, a, b) {
    const [x0, y0] = p,
        [x1, y1] = a,
        [x2, y2] = b
    return Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) / Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1))
  }   */


  removeSegment(d, point) {
    const [x, y] = point
    const points = []
    d.replace(/.([^ ]+) ([^ ]+) ?/g, (_, x, y) => {
      points.push([+x, +y])
    })
    const {length} = points
    let j
    let min = Number.MAX_SAFE_INTEGER
    for (let i = 0; i < length - 1; i++) {
      const distance = this.distanceToLine(point, points[i], points[i + 1])
      console.log(distance)
      if (distance < min) {
        min = distance
        j = i
      }
      break
    }
    //  console.log("distance", min, j)
    return d
  }


  select(params) {
    const {node, selected, scale, viewScale} = this,
        {offsetWidth, offsetHeight} = node.parentNode,
        {clientWidth, clientHeight} = node,
        realScale = scale * viewScale
    let {key, index, target, x, y} = params

    if (selected !== undefined) {
      if (target === selected) {
        const translated = this.screenToWidget(x, y)
        const [cx, cy] = translated
        const circle = Dom.create({parent: node, tag: "circle", attributes: {cx, cy, r: 1, stroke: "white", "stroke-width": .25, fill: "none"}})
        console.log(circle)
        const d = Dom.getAttribute(selected, "d")
        const e = this.removeSegment(d, translated)
        //  Dom.setAttribute(selected, "d", e)
        return
      }
      Dom.removeType(selected, "selected")
    }


    if (key === undefined) {
      this.selected = undefined
      return
    }

    this.selected = target
    node.removeChild(target)
    node.appendChild(target)
    Dom.addType(target, "selected")
  }

  initShapes({key, shapes}) {
    if (shapes === undefined) {
      return
    }
    const {node, paths} = this,
        {clientWidth, clientHeight} = node,
        areaPaths = paths[key] = []

    let area = 0
    const {length} = shapes
    for (const i in shapes) {
      const points = []
      const path = Dom.create({
            parent: node,
            tag: "path",
            attributes: {"data-event": "select", "data-key": key, "data-index": i}
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
//      console.log(i, sh `hsla(${i/shapes*360}, 100%, 50%, 1)`)
      Dom.style(path, {stroke: `hsla(${i / length * 360}, 100%, 50%, 1)`})
      area += this.area(points)
    }
    //   console.log(key, area)
  }

  initMap() {
    const {node, paths} = this,
        {countries} = core

//    console.log(countries.nl)
    //   this.initShapes(countries.nl)
    //   return

    const enable = {us: true, ca: true}
    for (const key in countries) {
      if (!enable[key]) {
        //   continue
      }
      this.initShapes(countries[key])
    }
    //   this.initShapes(countries.nl)
  }


  draw() {
    const {node, x, y, scale} = this,
        {offsetWidth, offsetHeight} = node.parentNode,
        {clientWidth, clientHeight} = node,
        scaleWidth = offsetWidth / clientWidth,
        scaleHeight = offsetHeight / clientHeight,
        viewScale = this.viewScale = scaleWidth < scaleHeight ? scaleWidth : scaleHeight,
        realScale = scale * viewScale,

        dx = (offsetWidth * (1 + x) / 2 - clientWidth / 2),
        dy = (offsetHeight * (1 + y) / 2 - clientHeight / 2),
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
    sessionStorage.setItem("location", JSON.stringify({x, y, scale}))
  }


}
