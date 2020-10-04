module.exports = class DataBranches extends PreCore.classes.Display {

create(params) {
  params.tag = "svg"
  console.log("@@@ Value @@@", params)
  super.create(params)
}
}
