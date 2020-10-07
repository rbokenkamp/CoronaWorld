module.exports = class UserInputs extends PreCore.classes.Tree {


  create(params) {
    this.checkDevice(params)
    super.create(params)

    this.createKeyboard()
    this.createMouse()
  }

  createKeyboard() {
    const {fullClient} = this
    document.onkeypress = e => {
      const {code, shiftKey} = e
      console.log(e)
      if (fullClient && code === "Space") {
        if (document.fullclientElement) {
          document.exitFullclient()
        } else {
          document.body.requestFullclient()
        }
      }
    }
  }

  createMouse() {
    const {node} = this
    let listenerTarget,
        dragging,
        position,
        previous,
        isScaling = false,
        previousScale = 1,
        touchDistance

    window.onmousedown = e => {
      const {target, clientX, clientY} = e
      const listener = Dom.getParent(target, "InputListener")
      dragging = false
      listenerTarget = listener ? listener.__display : undefined
      previous = position = [clientX, clientY]
      console.log("DOWN", clientX, clientY, listener)
    }

    window.onmousemove = e => {
      if (position) {
        const {clientX, clientY} = e
        const dx = clientX - position[0],
            dy = clientY - position[1],
            ddx = clientX - previous[0],
            ddy = clientY - previous[1]

        previous = [clientX, clientY]
        if (listenerTarget === undefined) {
          return
        }
        if (dragging === false) {
          if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            dragging = true
            listenerTarget.dragStart && listenerTarget.dragStart()
          }
        }
        if (dragging && listenerTarget) {
          listenerTarget.drag && listenerTarget.drag(dx, dy, ddx, ddy)
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
      if (listenerTarget) {
        listenerTarget.dragStop && listenerTarget.dragStop()
      }
    }

    window.ontouchstart = e => {
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

      window.onmousedown({target, pageX, pageY, touches, clientX, clientY,})
    }

    window.ontouchmove = e => {
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


    window.ontouchend = e => {
      isScaling = false
      previousScale = 1
      if (e.target.tagName === "INPUT") {
        return
      }
      window.onmouseup(e)
    }

  }

  checkDevice(params) {
    params.fullClient = document.fullclientEnabled

    try {
      const event = document.createEvent("TouchEvent")
      PostCore.log(event)
      params.hasTouch = true
      params.isAndroid = "touches" in event
    } catch (e) {
      params.hasTouch = false
      params.isAndroid = false
    }

  }

}
