const areas = require("./areas")
const countries = require("./countries")

const areaUs = areas.us
const actualUs = 9.834*1000000
const factor = actualUs/areaUs

for (const key in areas) {
  countries[key].area = areas[key]*factor
}

const fs = require("fs")
fs.writeFileSync(__dirname+"/countries2.js", JSON.stringify(countries))
