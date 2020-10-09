module.exports = class Widget extends PreCore.classes.Display {


  transitionGetDelta(a, b, steps) {
    const result = {}
    for (const key in a) {
      result[key] = (b[key] - a[key]) / steps
    }
    return result
  }

  transitionAddDelta(delta) {
    for (const key in delta) {
      this[key] += delta[key]
    }
  }

  transition(options) {
    const {x, y, scale, duration, steps, oncomplete} = options,
        delta = this.transitionGetDelta({scale: this.scale, x: this.x, y: this.y}, {scale, x, y}, steps)

    let i = 0
    const intervalId = setInterval(() => {
      this.transitionAddDelta(delta)
      const {scale, x, y} = this
      this.draw()
      i++
      if (i == steps) {
        clearInterval(intervalId)
        oncomplete && oncomplete()
      }
    }, duration / steps)
  }

}
