module.exports = class extends PreCore.classes.Branch {
  constructor(branches) {
    console.log("CREATE DATA", branches)
    super(branches)
    Object.assign(this, branches)
  }
}
