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

    let isScaling = false
    let previousScale = 1
    let touchDistance


    node.onmousedown = e => {
      const {target, clientX, clientY} = e
      const draggable = Dom.getParent(target, "Draggable")
      dragging = false
      dragTarget = draggable ? draggable.__display : undefined
      if (isScaling) {
        return
      }

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
      const {target, clientX, clientY} = e
      position = undefined
      if (dragging === false) {
        const [instance, event, params] = Dom.getEvent(target)
        if (event) {
          params.target = target
          params.x = clientX
          params.y = clientY
          instance[event](params)
        }
        return
      }
      if (dragTarget) {
        dragTarget.dragStop && dragTarget.dragStop()
      }
    }

    node.ontouchstart = e => {
      let {target, pageX, pageY, touches, clientX, clientY} = e
      if (target.tagName === "INPUT") {
        return
      }
      if (pageX === undefined) {
        const [a, b] = touches
        if (b) {
          e.preventDefault()
          e.stopPropagation()
          const dx = b.pageX - a.pageX,
              dy = b.pageY - a.pageY,
              distance = Math.sqrt(dx * dx + dy * dy)
          clientX = clientY = (a.pageX + b.pageX) / 2
          clientY = clientY = (a.pageY + b.pageY) / 2

          touchDistance = distance
          isScaling = true
        } else {
          clientX = clientY = a.pageX
          clientY = clientY = a.pageY
        }
      } else {
        clientX = clientY = pageX
        clientY = clientY = pageY
      }

      node.onmousedown({target, pageX, pageY, touches, clientX, clientY,})
    }

    window.totalScale = 1
    node.ontouchmove = e => {
      let {target, pageX, pageY, touches, clientX, clientY, scale} = e
      if (target.tagName === "INPUT") {
        return
      }
      if (pageX === undefined) {
        const [a, b] = touches
        if (b) {
          e.preventDefault()
          e.stopPropagation()
          const dx = b.pageX - a.pageX,
              dy = b.pageY - a.pageY,
              distance = Math.sqrt(dx * dx + dy * dy)
          clientX = clientY = (a.pageX + b.pageX) / 2
          clientY = clientY = (a.pageY + b.pageY) / 2
          scale = distance / touchDistance * previousScale
          touchDistance = distance
        } else {
          scale = 1
          clientX = clientY = a.pageX
          clientY = clientY = a.pageY
        }

      } else {
        clientX = clientY = pageX
        clientY = clientY = pageY
      }

      if (scale !== 1 || isScaling) {
        //  e.preventDefault()
        //  e.stopPropagation()
        isScaling = true
        const nextScale = scale / previousScale
        //  PostCore.log({scale, result: (nextScale !== 1 && dragTarget !== undefined})
        if (nextScale !== 1 && dragTarget !== undefined) {
          dragTarget.setScale && dragTarget.setScale(nextScale)
        }

        previousScale = scale
      }
      window.onmousemove({target, pageX, pageY, touches, clientX, clientY, scale})
    }


    node.ontouchend = e => {
      isScaling = false
      previousScale = 1
      if (e.target.tagName === "INPUT") {
        return
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
