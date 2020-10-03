module.exports = class Data extends PreCore.classes.Branch {
  constructor(branches) {
    super(branches)
    Object.assign(this, branches)
  }
}
