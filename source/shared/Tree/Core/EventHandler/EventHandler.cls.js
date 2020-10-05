const EventHandler = module.exports = class EventHandler extends PreCore.classes.Tree {

  create(params, options) {
    super.create(params, options)
    this.listeners = {}
    this.listenerIndex = 0
 }

  trigger(params) {
    const {listeners} = this
    for (const id in listeners) {
      const [filter, handler, once] = listeners[id]
      if (EventHandler.eligible(params, filter)) {
        handler(params)
        if (once) {
          delete listeners[id]
        }
      }
    }
  }

  static eligible(params, filter) {
    if (filter === undefined) {
      return true
    }
    if (typeof filter === "object") {
      for (const key in filter) {
        if (params[key]!== filter[key]) {
          return false
        }
      }
      return true
    }

    filter(params)
  }


  unlisten(id) {
    delete this.listeners[id]
  }

  listen(filter, handler, once) {
    const id = this.listenerIndex++
    this.listeners[id] = [filter, handler, once]
    return id
  }

}
