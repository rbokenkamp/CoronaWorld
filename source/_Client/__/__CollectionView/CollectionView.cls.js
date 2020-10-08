module.exports = class CollectionView extends PreCore.classes.Display {


  created(params) {
    super.created(params)
    const {dataPath, node} = this
    Dom.addType(node, "Draggable")
    let data = core.get(params.dataPath)
    data = this.data = data === undefined ? [] : Object.values(data)
    if (data.length === 0) {
      Dom.addType(node, "NoData")
      return Dom.set(this.node, "No data available")
    }

    this.itemsNode = Dom.create({parent: this.node, types: ["CollectionViewItems"]})


    this.wheelIndex = 0

    let timeout
    let delta = 0
    window.onwheel = ({deltaY}) => {
      delta += deltaY
      if (timeout) {
        return
      }
      setTimeout(() => {
        let negativeFactor = -1
        if (delta < 0) {
          delta = -delta
          negativeFactor = 1
        }
        delta = Math.max(1, Math.round(delta / 10))
        const wheelIndex = this.wheelIndex + negativeFactor * delta
        this.wheelIndex = wheelIndex < 0 ? wheelIndex + data.length : wheelIndex % data.length
        this.draw()
        timeout = null
        delta = 0
      }, 100)
    }

    this.listen({event: "menu-move"}, () => {
      this.draw()
    })
    this.listen({event: "collection-select"}, ({key}) => {
      this.setSelected(key)
    })
  }

  setWidths() {
    const {itemsNode} = this,
        max = {}

    if (this.style) {
      this.setStyle()
    }

    for (const row of itemsNode.children) {
      let i = 0
      for (const column of row.children) {
        const first = column.children[0]
        const width = first.offsetWidth || first.clientWidth // SVG behaves different
        max[i] = Math.max(max[i] === undefined ? 0 : max[i], width)
        i++
      }
    }

    let style = ""
    for (const i in max) {
      style += `#d${this.id} .CollectionViewItem > *:nth-child(${+i + 1}) {
width: ${max[i]}px;
}
`
    }
    this.setStyle(style)
  }

  select(params) {
    const {key} = params
    core.events.trigger({event: "collection-select", key})
  }

  setSelected(key) {
    const index = this.data.findIndex(value => value.key === key)
    this.selectedIndex = index
    this.draw()
  }

  drag(dx, dy, ddx, ddy) {
    const {data} = this
    let index = this.wheelIndex + ddy
    index = index < 0 ? index + data.length : index
    this.wheelIndex = index > data.length ? index - data.length : index
    this.draw()
  }

  draw() {
    const {parent, node, dataPath, itemsNode, data, wheelIndex, items, selectedIndex} = this

    if (data.length === 0) {
      return
    }

    const {offsetWidth, offsetHeight} = parent.node

    for (const key in items) {
      Dom.style(items[key].node, {display: "none"})
    }

    let i = 0
    while (true) {
      const index = (i + wheelIndex) % data.length
      const obj = data[index],
          {key} = obj
      let item = items[i]

      if (item === undefined) {
        item = this.items.branch({
          key: `${i}`,
          type: "CountryItem",
          index: index,
          dataPath: `${dataPath}/${key}`,
          parentNode: itemsNode
        })
        Dom.addType(item.node, "CollectionViewItem")
      } else {
        item.dataPath = `${dataPath}/${key}`
        item.index = index
        Dom.style(item.node, {display: ""})
        item.refresh()
      }

      Dom.setAttributes(item.node, {"data-event": "select", "data-key": key})
      Dom[(selectedIndex === index ? "add" : "remove")+"Type"](item.node, "selected")

      if (itemsNode.offsetHeight >= node.parentNode.offsetHeight || i > 99) {
        break
      }
      i++
    }

    setTimeout(() => this.setWidths())
  }

}
