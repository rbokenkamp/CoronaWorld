module.exports = {
  type: "Type",
  extend: "Branch",
  errors: {
    text_invalid_type: "${path} expects Text",
    text_too_small: "${path} length ${length} smaller then minimum ${min}",
    text_too_large: "${path} length ${length} greater then maximum ${max}",
    text_rule_mismatch: "${path} data ${data} does not match rule ${rule}"
  },

}
