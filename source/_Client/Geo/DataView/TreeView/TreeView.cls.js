module.exports = class TreeView extends PreCore.classes.Table {

  create(params) {
    super.create(params)
    const {node, dataPath} = this

    const data = this.data = core.get(dataPath)
    const metas = this.metas = PreCore.types[data.type].instance

    for (const key in data) {
      if (key in metas === false) {
        continue
      }
      const meta = metas[key]
      const {internal, type} = meta
      if (internal) {
        continue
      }
      const rowNode = Dom.create({parent: node, types: ["Row"]})
      const keyNode = this.createItem(rowNode, "Key", key)
      const valueNode = this.createValueItem(rowNode, key, meta, data[key])
      //  console.log(key, item)

    }

    this.setWidths()

  }

  createTree(current) {

  }

}
