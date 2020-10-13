const https = require("https"),
    fs = require("fs")

module.exports = class extends PreCore.classes.Tree {
  create(data) {
    super.create(data)
    const countries = require(__dirname + "/data/countries")

    this.timeline(countries)
    // fetch data every 4 hours
    //  setInterval(() => this.timeline(), 1000 * 4 * 3600)
    this.parent.setBranch("countries", countries)
  }

  async fetch(alpha2) {
    return new Promise((resolve, reject) => {
      const options = {
        host: "api.thevirustracker.com",
        path: `/free-api?countryTimeline=${alpha2}`,
      }

      console.log(alpha2)
      https.request(options, response => {
        let data = ""

        response.on('data', chunk => data += chunk)

        response.on('end', () => {
          resolve(data.replace(/^[^\{]*\{/, "{")) // on occation there may be php error preceding the JSON output (see bottom)
        })
      }).end()

    })
  }

  convert(date) {
    let [month, day, year] = date.split("/")

    month = +month
    day = +day
    year = +year + 2000
    return new Date(Date.UTC(year, month - 1, day))
  }


  async timeline(countries) {
    const t0 = Date.now(),
        {TextDate} = PreCore.classes,
        {dateToText} = TextDate

     const countriesTimeline = {}
    for (const alpha2 in countries) {
      const country = countries[alpha2],
          {corona} = country,
          timeline = countriesTimeline[alpha2] = {}

      if (corona === true) {
        try {
//          const {timelineitems} = JSON.parse(await this.fetch(alpha2))
          // fs.writeFileSync(__dirname + "/_cache/" + alpha2 + ".js", "module.exports=" + PreCore.toSource(timelineitems))
          const timelineitems = require(__dirname + "/_cache/" + alpha2)
          if (timelineitems === undefined) {
            continue
          }
          const [items] = timelineitems
          let recoveries = 0
          for (const key in items) {
            if (key === "stat") {
              continue
            }
            const date = dateToText(this.convert(key)),
                item = items[key]

            const {
              new_daily_cases,
              new_daily_deaths,
              total_recoveries
            } = item


            const new_daily_recoveries = total_recoveries - recoveries

            recoveries = total_recoveries

            timeline[date] = [new_daily_cases, new_daily_deaths, new_daily_recoveries]
          }
        } catch (err) {
          console.log(err)
        }
      }
    }
   fs.writeFileSync(__dirname+"/data/timeline.js", "module.exports="+PreCore.toSource(countriesTimeline))
    console.log("timeline imported", {elapsed: Date.now() - t0})
  }
}

/*
<br />
<b>Warning</b>:  session_start(): open(/var/cpanel/php/sessions/ea-php72/sess_1518be81944c1cbc07f77527c48682af, O_RDWR) failed: No space left on device (28) in <b>/home/thevirustracker/api.thevirustracker.com/connections.php</b> on line <b>1</b><br />
<br />
<b>Warning</b>:  session_start(): Failed to read session data: files (path: /var/cpanel/php/sessions/ea-php72) in <b>/home/thevirustracker/api.thevirustracker.com/connections.php</b> on line <b>1</b><br />
{
   "results":[
      {
         "total_cases":33058423,
         "total_recovered":24409745,
         "total_unresolved":5940153,
         "total_deaths":998745,
         "total_new_cases_today":11356,
         "total_new_deaths_today":460,
         "total_active_cases":7490,
         "total_serious_cases":6591235,
         "total_affected_countries":213,
         "source":{
            "url":"https://thevirustracker.com/"
         }
      }
   ],
   "stat":"ok"
}
 */
