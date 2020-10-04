module.exports = class Table extends PreCore.classes.Display {

  createItem(parent, type, value) {
    const itemNode = Dom.create({parent, types: ["Item"]})
    const valueNode = Dom.create({parent: itemNode, types: [type], value, tag: "span"})

  }

  createValueItem(parentNode, key, meta, value) {
    const {type} = meta.type === "Link" ? value : meta,
        {kind} = PreCore.types[type]

    if (meta.type === "Link") {
      value = value.items
    }
    if (kind === "Tree") {
      return this.createItem(parentNode, "Tree", type)
    }
    if (kind === "Branch" || value === undefined) {
      value = value === undefined ? "" : ""+value
      value = value.substr(0, 50)
      return this.createItem(parentNode, type, value)
    }
    return this.createItem(parentNode, "Collection", type + " #" + Object.keys(value).length)
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
        max[i] = Math.max(max[i] === undefined ? 0 : max[i], column.clientWidth)
        i++
      }
    }

    let style = ""
    for (const i in max) {
      style += `#d${this.id} .Row > *:nth-child(${+i + 1}) {
width: ${max[i]}px;
}
`
    }
    this.setStyle(style)
  }


}
