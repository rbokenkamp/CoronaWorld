module.exports = {
  type: "Type",
  kind: "Branch",
  errors: {
    branch_required: "Branch ${path} must be set",
    branch_internal: "Branch ${path} is internal and cannot be set",
    type_not_exists: "Type ${type} does not exist for branch ${path}",
  },
}
