module.exports = class DataView extends PreCore.classes.Widget {

  run() {
    this.levels = []

    this.index = 0
    this.scan(this.dataPath, 0)
    console.log("-".repeat(50))
    super.run()
  }

  scanTree(instance, dataPath, level) {
    const {types} = PreCore
    const {type} = instance,
        metas = types[type].instance
    for (const key in metas) {
      const meta = metas[key],
          {kind, internal} = types[meta.type]
      if (kind === "Branch" || kind === "Data" || internal || instance[key] === undefined) {
        continue
      }
      this.scan(dataPath + "/" + key, level + 1)
    }

  }

  scan(dataPath, level) {
    const {columns} = this
    if (columns[level] === undefined) {
      columns.setItem(""+level, {type: "Column"})
    }
    const columnNode = columns[level].node
    const current = core.get(dataPath)
    const instance = current.getInstance(),
        {types, instanceOf} = PreCore

    if (instanceOf(instance, "Collection")) {
      this.nodes.setItem(dataPath, {type: "CollectionView", dataPath, parentNode: columnNode})
      const {item} = instance,
          {type} = item,
          {kind} = types[type]

      if (kind === "Tree") {
        for (const key in current) {
          this.scanTree(current[key], dataPath+"/"+key, level+1)
        }
      }
    } else {
      this.nodes.setItem(dataPath, {type: "TreeView", dataPath, parentNode: columnNode})

      this.scanTree(instance, dataPath, level)
    }


  }


}
