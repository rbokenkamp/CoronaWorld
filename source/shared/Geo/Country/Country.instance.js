module.exports = {
  alpha2: {
    type: "Text",
    rule: /^[a-z]{2}$/,
    required: true,
  },
  alpha3: {
    type: "Text",
    rule: /^[a-z]{3}$/,
    required: true,
  },
  flag: "Text",
  corona: "Boolean",
  regionCode: {
    type: "Text",
    rule: /^[0-9]{3}$/,
  },
  region: "Text",
   subRegionCode: {
    type: "Text",
    rule: /^[0-9]{3}/,
  },
  subRegion: "Text",
  intermediateRegionCode: {
    type: "Text",
    rule: /^[0-9]{3}/,
  },
  intermediateRegion: "Text",
  /*
  location: {
    type: "List",
    item: "Real",
    count: 2,
  },

   */
  location: "Branch",
  shapes: "Branch",


  stats: "Branch", //@TODO make this List
  lastInfections: "Real",
  deltaInfections: "Real",
  lastDeaths: "Real",
  deltaDeaths: "Real",
//  shapes: "List",
}
