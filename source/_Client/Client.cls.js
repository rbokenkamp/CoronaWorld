module.exports = class Client extends PreCore.classes.Core {

  create(params) {
    this.setStyles()
    super.create(params)
  }

  setStyles() {
    const {styles} = PreCore
    for (const key in styles) {
      const node = Dom.create({parent: document.head, tag: "style", attributes: {"data-key": key}})
      Dom.set(node, styles[key])
    }
  }
}


// navigator.serviceWorker.register("/js/worker.js").then(registration => console.log("CLIENT", registration.installing))
