module.exports = class LayoutList extends PreCore.classes.Display {

  create(params) {
    super.create(params)
    this.branch({key: "list", type: "CollectionView", dataPath: ""})
  }
}
