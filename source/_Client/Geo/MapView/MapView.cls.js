module.exports = class MapView extends PreCore.classes.Widget {

  create(params) {
    super.create(params)
    this.paths = {}
    this.initMap()
    this.listen({event: "menu-move"}, () => {
      this.draw()
    })

    window.onwheel = ({deltaY}) => {
      this.setScale(deltaY > 0 ? .9 : 1.1)
    }
  }

  dragStart() {
    this.dragX = this.x
    this.dragY = this.y
  }

  setScale(scale) {
    const previousScale = this.scale
    this.scale *= scale
   this.delayedDraw()
  //  PostCore.log({previousScale, scale, nextScale: this.scale, totalScale})
  }

  drag(dx, dy) {
    const {node, dragX, dragY} = this
    const {parentNode} = node
    const {offsetWidth, offsetHeight} = parentNode
    this.x = dragX + (dx * 2 / offsetWidth)
    this.y = dragY + (dy * 2 / offsetHeight)

    this.delayedDraw()
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


}
