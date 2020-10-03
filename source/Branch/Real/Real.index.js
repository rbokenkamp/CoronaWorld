module.exports = {
  type: "Type",
  extend: "Branch",
  errors: {
    real_invalid_type: "${path} expects Real",
    real_too_small: "${path} ${data} smaller then minimum ${min}",
    real_too_large: "${path} ${data} greater then maximum ${max}",
  },
}
