module.exports = class Layout extends PreCore.classes.Selector {

  create(params) {
    params.value = 0.5
    super.create(params)
    const {area, node} = this
    params.list = {
      type: "CollectionView",
      dataPath: area === "country" ? "/countries" : "/regions",
      itemType: area === "country" ? "CountryItem" : "RegionItem",
      parentNode: node.querySelector(".Selector-Bottom"),
      bindPath: this.path + "/selectedCountry",
      aspectBind: this.path + "/aspect",
    }
    this.listen({event: "set", path: this.path + "/value"}, params => {
      this.map.draw()
      this.list.draw()
    })
  }

}
