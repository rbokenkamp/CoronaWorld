module.exports = class Layout extends PreCore.classes.Selector {

  create(params) {
    super.create(params)
    const {area, node} = this
    params.list = {
      type: "CollectionView",
      dataPath: area === "country" ? "/countries" : "/regions",
      itemType: area === "country" ? "CountryItem" : "RegionItem",
      parentNode: node.querySelector(".Selector-Bottom"),
      bindPath: this.path + "/selectedCountry"
    }
    this.listen({event: "set", path: this.path + "/value"}, params => {
      this.map.draw()
      this.list.draw()
    })
  }

  created(params) {
    console.log(params)
    super.created(params)
  }


}
