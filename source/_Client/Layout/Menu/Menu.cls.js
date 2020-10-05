module.exports = class Menu extends PreCore.classes.Display {

  dragStart() {
    this.dragY = this.y
  }

  drag(dx, dy) {
    const {parent, node} = this,
        parentNode = parent.node.querySelector(".Layout-Body")

    if (parent.landscape) {
      const width = (parentNode.offsetWidth - node.offsetWidth) / 2
      this.y = Math.min(this.dragY + dx / width, 1)
    } else {
      const height = (parentNode.offsetHeight - node.offsetHeight) / 2

      this.y = Math.min(this.dragY + dy / height, 1)
    }
    this.draw()
    core.events.trigger({event: "menu-move"})
  }

  draw() {
    const {y, parent, node} = this

    const parentNode = parent.node.querySelector(".Layout-Body"),
        map = parentNode.querySelector(".Map")

    if (parent.landscape) {
      const width = (parentNode.offsetWidth - node.offsetWidth) / 2 * (y + 1)

      Dom.style(map, {flex: `0 0 ${width}px`})
    } else {
      const height = (parentNode.offsetHeight - node.offsetHeight) / 2 * (y + 1)
      Dom.style(map, {flex: `0 0 ${height}px`})
    }
  }

}
