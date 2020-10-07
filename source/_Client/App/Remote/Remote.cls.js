module.exports = class Remote extends PreCore.classes.Display {

  create(params) {
  //  if (location.pathname === "/qr") {
  //    const key = location.search.substr(1)
  //    this.remoteKey = key
      params.layout = {type: "Layout"}
  //  }
 //   else {
  //    params.qr = {type: "QrGenerator"}
  //  }

    super.create(params)
  }

  draw() {
    console.log("DRAW")
    let {node, orientation} = this,
        {parentNode} = node,
        {clientWidth, clientHeight} = parentNode,
        landscape = clientWidth > clientHeight,
        isHorizontal = this.isHorizontal = orientation !== "vertical" && (orientation === "horizontal" || landscape)

    Dom[(isHorizontal ? "add" : "remove") + "Type"](node, "Horizontal")
    Dom[(isHorizontal ? "remove" : "add") + "Type"](node, "Vertical")

    this.displayWidth = node.clientWidth
    this.displayHeight = node.clientHeight

  }
}
