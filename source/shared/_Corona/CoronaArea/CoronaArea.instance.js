module.exports = {
  code: {
    type: "Text",
    rule: /^[0-9]{3}$/,
    required: true,
  },
  name: {
    type: "Text",
    required: true,
  },
  population: "Integer",
  area: "Real",
  /*
  timeline: "Branch",
  stats: "Branch",
  newInfections: "Real",
  newDeaths: "Real",

   */
}
