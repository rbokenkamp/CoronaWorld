module.exports = class CollectionView extends PreCore.classes.Display {


  create(params) {
    params.types = ["InputListener"]
    super.create(params)
    const collection = core.get(this.dataPath)
    this.data = collection === undefined ? [] : Object.values(collection)

    const index = this.scrollIndex = 0
    window.onwheel = ({deltaY}) => {
      const negativeFactor = deltaY > 0 ? 1 : -1
      this.drag(0, 0, 0, negativeFactor * Math.max(1, Math.round(Math.abs(deltaY) / 10)))
    }
    this.queueInterval = undefined
    this.queue = []
  }

  drag(dx, dy, ddx, ddy) {
    if (ddy === 0) {
      return
    }

    //console.log(ddy)
    const maxTicks = 4

    const {queue} = this,
        negativeFactor = ddy < 0 ? -1 : 1
    let n = Math.abs(ddy)

    while (n > maxTicks) {
      queue.push(negativeFactor * maxTicks)
      n -= maxTicks
    }
    if (n) {
      queue.push(negativeFactor * n)
    }

    if (this.queueInterval) {
      return
    }
    this.queueInterval = setInterval(() => {
      const dy = queue.shift()
      this.scrollIndex += dy
      this.refresh()
      if (queue.length === 0) {
        clearInterval(this.queueInterval)
        delete this.queueInterval
      }
    }, 5)
  }

  setWidths() {
    const {node} = this,
        max = {}

    if (this.style) {
      this.setStyle()
    }

    for (const row of node.children) {
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
    console.log("select", params)
    const {key} = params
    core.trigger({event: "collection-select", key})
  }

  setSelected(key) {
    if (this.selectedIndex) {
      Dom.removeType(this.items[this.selectedIndex].node, "selected")
    }
    const index = this.data.findIndex(value => value.key === key)
    Dom.addType(this.items[index].node, "selected")
    this.selectedIndex = index
  }


  draw() {
    const scrollTicks = 3,
        changeFontSizeWidth = 400,
        {data, node, items, itemType, scrollIndex} = this,
        {length} = data,
        {parentNode, clientWidth} = node,
        fontSize = clientWidth >= changeFontSizeWidth ? "" : clientWidth / changeFontSizeWidth * 16

    Dom.style(node, {"font-size": `${fontSize}px`})
    Dom.toggleType(node, "NoData", length === 0)
    if (length === 0) {
      return Dom.set(node, "no data")
    }

    let i = 0,
        height = 0


    const adjusted = PreCore.mod(scrollIndex / scrollTicks, data.length),
        residu = adjusted % 1

    let index = Math.floor(adjusted)
    while (true) {
      const dataPath = this.dataPath + "/" + data[index].key

      if (items[i] === undefined) {
        items.setItem("" + i, {
          type: itemType,
          index,
          dataPath,
          types: ["CollectionViewItem"]
        })
      } else {
        const item = Object.assign(items[i], {index, dataPath})
        item.refresh()
      }
      height += items[i].node.clientHeight
      if (height > parentNode.clientHeight) {
        break
      }
      i++
      index = (index + 1) % length
    }
    Dom.style(node, {"margin-top": `-${residu * items[i].node.clientHeight}px`})
    this.setWidths()

  }


}
