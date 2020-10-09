module.exports = class Menu extends PreCore.classes.Marker {

  create(params) {
    super.create(params)
    this.setAspect(this.parent.aspect)
    this.listen({event: "set", path: "/app/layout/aspect"}, ({value}) => {
      this.setAspect(value)
    })
  }

  setAspect(aspect) {
    const {node} = this
    Dom.querySelectorAll(node, ".selected[data-event=selectAspect]").forEach(node => {
      Dom.removeType(node, "selected")
    })
    Dom.addType(Dom.querySelector(node, `[data-value=${aspect}]`), "selected")
  }
}
