module.exports = class CollectionView extends PreCore.classes.Display {


  create(params) {
    params.types = ["InputListener"]
    super.create(params)
    const {dataPath, bindPath, aspectBind, scrollTicks} = this,
        collection = core.get(dataPath),
        data = this.data = collection === undefined ? [] : Object.values(collection)

    this.scrollIndex = 0
    this.queueInterval = undefined
    this.queue = []
    if (bindPath) {
      const key = this.selected = core.get(bindPath),
          index = data.findIndex(a => a.key === key)

      if (index !== -1) {
        this.scrollIndex = scrollTicks * index
      }


      // console.log( core.app.layout)
      this.listen({event: "set", path: bindPath}, ({value}) => {
        this.selected = value
        const index = data.findIndex(a => a.key === value) - Math.floor(this.count / 2)
        this.scrollIndex = scrollTicks * index
        this.draw()
      })

      this.listen({event: "set", path: aspectBind}, ({value}) => {
        if (this.selected) {
          const index = data.findIndex(a => a.key === value) - Math.floor(this.count / 2)
          this.scrollIndex = scrollTicks * index
        }
        this.draw()
      })
    }
  }

  initData() {
    const {aspectBind} = this,
        aspect = this.aspect = core.get(aspectBind)

    this.data.sort((a, b) => (a.getScore(aspect) || 0) > (b.getScore(aspect) || 0) ? -1 : 1)

  }


  wheel(deltaY) {
    const negativeFactor = deltaY > 0 ? -1 : 1
    this.drag(0, 0, 0, negativeFactor * Math.max(1, Math.round(Math.abs(deltaY) / 10)))
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
    }, 10)
  }

  setWidths() {
    const {node} = this,
        maxWidths = {}

    if (this.style) {
      this.setStyle()
    }

    let maxHeight = 0

    for (const row of node.children) {
      let i = 0
      maxHeight = Math.max(maxHeight, row.clientHeight)
      for (const column of row.children) {
        const first = column.children[0]
        const width = first.offsetWidth || first.clientWidth // SVG behaves different
        maxWidths[i] = Math.max(maxWidths[i] === undefined ? 0 : maxWidths[i], width)
        i++
      }
    }

    let style = ""
    for (const i in maxWidths) {
      style += `
#d${this.id} .CollectionViewItem > *:nth-child(${+i + 1}) {
    width: ${maxWidths[i]}px;
}
#d${this.id} .CollectionViewItem {
    height: ${maxHeight}px;
}
`
    }
    this.setStyle(style)
    return maxHeight
  }

  select({key}) {
    const {bindPath} = this
    if (bindPath) {
      core.set(key, bindPath)
    }
    this.selected = key
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
    const changeFontSizeWidth = 400,
        {scrollTicks, data, node, items, itemType, scrollIndex, selected} = this,
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
      const key = data[index].key
      const dataPath = this.dataPath + "/" + key

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
      const item = items[i],
          itemNode = item.node
      height += itemNode.clientHeight
      Dom.toggleType(itemNode, "selected", selected === key)
      Dom.setAttributes(itemNode, {
        "data-event": "select",
        "data-key": key
      })
      if (height > parentNode.clientHeight) {
        break
      }
      i++
      index = (index + 1) % length
    }
    this.count = i
    const maxHeight = this.setWidths()
    Dom.style(node, {"margin-top": `-${residu * maxHeight}px`})

  }


}
