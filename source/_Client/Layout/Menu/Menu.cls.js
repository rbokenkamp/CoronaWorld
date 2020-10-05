module.exports = class Menu extends PreCore.classes.Display {

  dragStart() {
    this.dragY = this.y
  }

  drag(dx, dy) {
    const {parent, node} = this,
        parentNode = parent.node,
        timeline = parent.timeline.node,
        height = (parentNode.offsetHeight - timeline.offsetHeight - node.offsetHeight) / 2

    this.y = Math.min(this.dragY + dy / height, 1+(timeline.offsetHeight/height))
    this.draw()
  }

  draw() {
    const {y, parent, node} = this

     if (parent.timeline === undefined) {
      return setTimeout(() => this.draw())
    }
    const parentNode = parent.node,
        timeline = parent.timeline.node,
        map = parentNode.querySelector(".Map"),
        height = (parentNode.offsetHeight - timeline.offsetHeight - node.offsetHeight) / 2 * (y + 1)

    Dom.style(map, {flex: `0 0 ${height}px`})
  }

}
