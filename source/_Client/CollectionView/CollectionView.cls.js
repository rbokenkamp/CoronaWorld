module.exports = class CollectionView extends PreCore.classes.Display {


  created(params) {
    super.created(params)
    const collection = core.get(this.dataPath)
    this.data = collection === undefined ? [] : Object.values(collection)
    console.log("YES")
  }

  setWidths() {
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

  }


}
