module.exports = class Mockup extends PreCore.classes.Display {

  draw() {
    return
    const {node} = this
    const {clientWidth, clientHeight} = node.children[0],
        size = clientWidth > clientHeight ? clientHeight : clientWidth

    console.log({size})
    const map = Dom.querySelector(node, ".Mockup-Map")

    Dom.style(map, {
      width: `${size}px`,
      height: `${size}px`,
    })
  }

  build(params) {
    super.build(params)
    this.signal("draw")
  }

}
