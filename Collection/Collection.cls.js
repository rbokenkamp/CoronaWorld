module.exports = class extends PreCore.classes.Tree {

  create(params) {
    console.log("CREATE COLLECTION")
    const {instanceOf, classes} = PreCore
    super.create(params)
  //  params.items
    return this.items
  }
}
