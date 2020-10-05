module.exports = class Data extends PreCore.classes.Branch {
  constructor(branches) {
    super(branches)
    Object.assign(this, branches)
  }

  setItem(key, value) {
    return this.__instance.setItem(key, value)
  }

  branch(params) {
    return this.__instance.setItem(params.key, params)
  }

  getCount() {
    return Object.keys(this).length
  }

  getInstance() {
    return this.__instance
  }

}
