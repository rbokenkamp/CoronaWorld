module.exports = class Layout extends PreCore.classes.Selector {

  create(params) {
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

    if (location.pathname === "/qr") {
      this.branch({key: "qrClient", type: "RemoteClient", code: location.search.substr(1)})
    }
  }

  selectAspect({value}) {
    this.setBranch("aspect", value)
  }

  generateQr() {
    const qr = this.branch({key: "qrCode", type: "QrCode"})
   qr.draw()
  }

}
