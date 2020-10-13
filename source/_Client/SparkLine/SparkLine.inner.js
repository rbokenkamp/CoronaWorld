module.exports = {
  line: {
    type: "Branch",
    internal: true,
  },
  country: {
    type: "Text",
    rule: /^[a-z]{2}$/,
    defaultValue: "nl",
    updatable: true,
  },
  daysAverage: {
    type: "Integer",
    defaultValue: 7,
    updatable: true,
  },
  reduce: "Integer",
  data: "List",
  line: {
    type: "Branch",
    internal: true,
  }
}
