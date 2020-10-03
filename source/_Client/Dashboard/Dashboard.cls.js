module.exports = class Dashboard extends PreCore.classes.Display {

  create(params) {
    params.widget = {type: "Widget"}
    super.create(params)
  }
}
