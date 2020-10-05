module.exports = class CollectionView extends PreCore.classes.Table {

  create(params) {
    super.create(params)
    return
    const {node, dataPath} = this

    const data = this.data = core.get(dataPath)

    console.log(dataPath, data.__instance)
    const    self = data.__instance,
        {item} = self,
        {type} = item,
        {kind, instance} = PreCore.types[type]

    if (kind === "Tree") {
      this.createHeaderRow(instance)
    }

    for (const key in data) {
      const rowNode = Dom.create({parent: node, types: ["Row"]})
      if (kind === "Tree") {
        this.createTreeRow(rowNode, instance, data[key])
      } else {
        const keyNode = this.createItem(rowNode, "Key", key)
        const valueNode = this.createValueItem(rowNode, key, item, data[key])
      }
    }

    this.setWidths()

  }

  createHeaderRow(metas) {
    const {node} = this
    const rowNode = Dom.create({parent: node, types: ["Row"]})
    for (const key in metas) {
      const meta = metas[key],
          {internal} = meta
      if (internal) {
        continue
      }
      const headerNode = this.createItem(rowNode, "Key", key)
    }
  }

  createTreeRow(rowNode, metas, value) {
    for (const key in metas) {
      const meta = metas[key],
          {internal} = meta
      if (internal) {
        continue
      }
      const valueNode = this.createValueItem(rowNode, key, metas[key], value[key])
    }

  }


}
