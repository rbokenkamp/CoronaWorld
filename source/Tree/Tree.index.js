module.exports = {
  type: "Type",
  extend: "Branch",
  kind: "Tree",
  errors: {
    error_not_exists: "Error ${name} does not exist for ${path}",
    tree_invalid_type: "${path} expects Tree",
    tree_unknown_param: "Branch ${path} does not exist",
    type_not_exists: "Type ${type} does not exist for ${path}",
    tree_non_updatable: "Param ${path} cannot be updated",
    tree_internal_param: "Param ${path} is internal",
    tree_nonextended_type: "${path} is of type ${type} while expecting ${metaType}"
  }
}
