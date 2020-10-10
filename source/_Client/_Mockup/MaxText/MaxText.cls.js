module.exports = class MaxText extends PreCore.classes.Display {

  create(params) {
    return
    super.create(params)
    const {node} = this
    const fontSize = this.fontSize = 54
    Dom.set(node, this.value)
    Dom.style(node,{ "font-size": `${fontSize}px`})
  }
  draw() {
    const {value, node} = this,
        {clientWidth, clientHeight} = node

    console.log({clientWidth, clientHeight})
  }
}
