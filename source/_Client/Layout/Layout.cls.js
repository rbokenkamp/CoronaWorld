module.exports = class Layout extends PreCore.classes.Display {

  create(params) {
    super.create(params)
    this.initControls()
  }

  initControls() {
    const {node} = this

    let dragTarget
    let dragging
    let position
    let previous

    node.onmousedown = e => {
      const {target, clientX, clientY} = e
      const draggable = Dom.getParent(target, "Draggable")
      dragging = false
      dragTarget = draggable ? draggable.__display : undefined
      previous = position = [clientX, clientY]
    }

    window.onmousemove = e => {
      if (position) {
        const {clientX, clientY} = e
        const dx = clientX - position[0],
            dy = clientY - position[1],
            ddx = clientX - previous[0],
            ddy = clientY - previous[1]

        previous = [clientX, clientY]
        if (dragTarget === undefined) {
          return
        }
        if (dragging === false) {
          if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            dragging = true
            dragTarget.dragStart && dragTarget.dragStart()
          }
        }
        if (dragging && dragTarget) {
          dragTarget.drag && dragTarget.drag(dx, dy, ddx, ddy)
        }
      }
    }

    window.onmouseup = e => {
      const {target} = e
      position = undefined
      if (dragging === false) {
        const [instance, event, params] = Dom.getEvent(target)
        if (event) {
          instance[event](params)
        }
        return
      }
      if (dragTarget) {
        dragTarget.dragStop && dragTarget.dragStop()
      }
    }

    node.ontouchstart = e => {
      if (e.target.tagName === "INPUT") {
        return
      }
      if (e.pageX === undefined) {
        const f = e.targetTouches[0]
        e.clientX = e.screenY = f.pageX
        e.clientY = e.screenY = f.pageY
      } else {
        e.clientX = e.screenY = e.pageX
        e.clientY = e.screenY = e.pageY
      }

      node.onmousedown(e)
      e.preventDefault()
      e.stopPropagation()
    }

    node.ontouchmove = e => {
      if (e.target.tagName === "INPUT") {
        return
      }
      if (e.pageX === undefined) {
        const f = e.targetTouches[0]
        e.clientX = e.screenY = f.pageX
        e.clientY = e.screenY = f.pageY
      } else {
        e.clientX = e.screenY = e.pageX
        e.clientY = e.screenY = e.pageY
      }
      window.onmousemove(e)
      e.preventDefault()
      e.stopPropagation()
    }

    node.ontouchend = e => {
      if (e.target.tagName === "INPUT") {
        return
      }
      if (e.pageX === undefined) {
        const f = e.targetTouches[0]
        e.clientX = e.screenY = f.pageX
        e.clientY = e.screenY = f.pageY
      } else {
        e.clientX = e.screenY = e.pageX
        e.clientY = e.screenY = e.pageY
      }
      window.onmouseup(e)
    }

  }

  draw() {
    const {node} = this

    const landscape = this.landscape = innerWidth > innerHeight
    Dom[(landscape ? "add" : "remove") + "Type"](node, "Landscape")
  }

}
