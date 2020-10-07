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
    let dragTarget
    let dragging
    let position
    let previous

    let isScaling = false
    let previousScale = 1
    let touchDistance

    window.onmousedown = e => {
      const {target, clientX, clientY} = e
      const draggable = Dom.getParent(target, "Draggable")
      dragging = false
      dragTarget = draggable ? draggable.__display : undefined
      if (isScaling) {
        return
      }

      previous = position = [clientX, clientY]
      console.log("DOWN", clientX, clientY)
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
