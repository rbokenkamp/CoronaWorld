module.exports = class Selector extends PreCore.classes.Display {


  create(params) {
    super.create(params)
    this.listen({event: "set", path: this.path+"/value"}, params => {
      this.refresh()
    })
  }
  draw() {
    let {node, orientation, marker, value} = this,
        top = node.querySelector(".Selector-Top"),
        {size} = marker,
        {parentNode} = node,
        {clientWidth, clientHeight} = parentNode,
        landscape = clientWidth > clientHeight,
        isHorizontal = this.isHorizontal = orientation !== "vertical" && (orientation === "horizontal" || landscape)

    Dom[(isHorizontal ? "add" : "remove") + "Type"](node, "Horizontal")
    Dom[(isHorizontal ? "remove" : "add") + "Type"](node, "Vertical")

    if (isHorizontal) {
      Dom.style(top, {
        width: `${ (value+1)/2*(1-size)*node.clientWidth}px`,
        height: "",
      })
    }
    else {
      Dom.style(top, {
        width: "",
        height: `${ (value+1)/2*(1-size)*node.clientHeight}px`,
      })
    }

  }
}
