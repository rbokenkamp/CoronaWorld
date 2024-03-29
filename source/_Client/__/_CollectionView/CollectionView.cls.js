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


    let index = 0
    for (const obj of data) {
      const {key} = obj
      const item = this.items.branch({
        key: `${index}`,
        type: "CountryItem",
        dataPath: `${dataPath}/${key}`,
        //   parentNode: itemsNode
      })
      Dom.addType(item.node, "CollectionViewItem")
      Dom.setAttributes(item.node, {"data-event": "select", "data-key": key})
      index++
    }
    this.setWidths()

    this.listen({event: "menu-move"}, () => {
      this.draw()
    })
    this.listen({event: "collection-select"}, ({key}) => {
      this.setSelected(key)
    })
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
    core.events.trigger({event: "collection-select", key})
  }

  setSelected(key) {
    if (this.selectedIndex) {
      Dom.removeType(this.items[this.selectedIndex].node, "selected")
    }
    const index = this.data.findIndex(value => value.key === key)
    Dom.addType(this.items[index].node, "selected")
    this.selectedIndex = index
  }

}
