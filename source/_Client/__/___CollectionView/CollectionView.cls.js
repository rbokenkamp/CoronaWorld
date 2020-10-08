module.exports = class CollectionView extends PreCore.classes.Display {


  created(params) {
    super.created(params)
    }

    /*
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
*/
}
