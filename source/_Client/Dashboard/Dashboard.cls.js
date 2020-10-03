module.exports = class Dashboard extends PreCore.classes.Display {

  created(params) {
      this.branch({type: "Widget", key: "widget"})
  }
}
