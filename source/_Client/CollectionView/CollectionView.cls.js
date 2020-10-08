module.exports = class CollectionView extends PreCore.classes.Display {


  created(params) {
    super.created(params)
    const collection = core.get(this.dataPath)
    this.data = collection === undefined ? [] : Object.values(collection)

    const index = this.scrollIndex = 0
    window.onwheel = ({deltaY}) => {
      const negativeFactor = deltaY > 0 ? 1 : -1
      this.scrollIndex += negativeFactor  * Math.max(1, Math.round(Math.abs(deltaY) / 10))
      this.refresh()
    }
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

  draw() {
    const {data, node, items, itemType, scrollIndex} = this,
        {length} = data,
        {parentNode} = node

    Dom.toggleType(node, "NoData", length === 0)
    if (length === 0) {
      return Dom.set(node, "no data")
    }

    let i = 0,
        height = 0

    const scrollTicks = 3

    const adjusted = PreCore.mod(scrollIndex / scrollTicks, data.length),
        residu = adjusted % 1

    let index = Math.floor(adjusted)

    console.log({scrollIndex, adjusted, residu, index})
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
    Dom.style(node, {"margin-top": `-${residu*items[i].node.clientHeight}px`})
    this.setWidths()

  }


}
