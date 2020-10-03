module.exports = {
  type: "Type",
  extend: "Branch",
  errors: {
    integer_invalid_type: "${path} expects Integer",
    integer_too_small: "${path} ${data} smaller then minimum ${min}",
    integer_too_large: "${path} ${data} greater then maximum ${max}",
  },
}
