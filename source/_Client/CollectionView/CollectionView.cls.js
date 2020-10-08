module.exports = class CollectionView extends PreCore.classes.Display {


  created(params) {
    super.created(params)
    const collection = core.get(this.dataPath)
    this.data = collection === undefined ? [] : Object.values(collection)
    console.log("YES")
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
    const {dataPath, data, node, items, itemType} = this,
        {length} = data
    Dom.toggleType(node, "NoData", length === 0)
    if (length === 0) {
      return Dom.set(node, "no data")
    }

    for (let i = 0; i < 5; i++) {
      const index = i
      items.setItem("" + index, {type: itemType, index: index, dataPath: dataPath + "/" + data[index].key})
    }
    this.setWidths()

  }


}
