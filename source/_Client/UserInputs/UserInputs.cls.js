module.exports = class UserInputs extends PreCore.classes.Tree {


  create(params) {
    super.create(params)

    this.createKeyboard()
    this.createMouse()
  }

  createKeyboard() {
    const {fullClient} = this
    document.onkeypress = e => {
      console.log(e)
      const {code, shiftKey} = e
      if (code === "Space" && document.fullscreenEnabled) {
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          document.body.requestFullscreen()
        }
      }
    }
  }

  createMouse() {
    const node = document.body.querySelector(".App")
    let listenerTarget,
        dragging,
        position,
        previous,
        isScaling = false,
        previousScale = 1,
        touchDistance

    window.onwheel = ({deltaY}) => {
      if (listenerTarget && listenerTarget.wheel) {
        listenerTarget.wheel(deltaY)
      }
    }

    window.onmousedown = e => {
      const {target, clientX, clientY} = e
      const listener = Dom.getParent(target, "InputListener")
      dragging = false
      listenerTarget = listener ? listener.__display : undefined
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

    let lastTouch = [] // android doesn't give last pageX, pageY info on touchend
    node.ontouchstart = e => {
      let {target, pageX, pageY, touches, clientX, clientY} = e
      if (target.tagName === "INPUT") {
        return
      }

      e.preventDefault()
      e.stopPropagation()
      if (pageX === undefined) {
        const [a, b] = touches
        if (b) {
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
      lastTouch = [clientX, clientY]
      window.onmousedown({target, clientX, clientY})
    }

    node.ontouchmove = e => {
      let {target, pageX, pageY, touches, clientX, clientY, scale} = e
      if (target.tagName === "INPUT") {
        return
      }
      e.preventDefault()
      e.stopPropagation()
      if (pageX === undefined) {
        const [a, b] = touches
        if (b) {
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
        isScaling = true
        const nextScale = scale / previousScale
        if (nextScale !== 1 && listenerTarget !== undefined) {
          listenerTarget.setScale && listenerTarget.setScale(nextScale)
        }

        previousScale = scale
      }

      lastTouch = [clientX, clientY]
      window.onmousemove({target, pageX, pageY, touches, clientX, clientY, scale})
    }


    window.ontouchend = e => {
      let {target} = e
      isScaling = false
      previousScale = 1
      if (target.tagName === "INPUT") {
        return
      }
      e.preventDefault()
      e.stopPropagation()
      const [clientX, clientY] = lastTouch
      window.onmouseup({target, clientX, clientY})
    }

  }


}
