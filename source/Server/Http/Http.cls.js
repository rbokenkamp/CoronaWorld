const httpWrite = (response, status, content, mime, deflated, timestamp) => {
      const headers = {
        "Content-Type": mime || "text/plain",
      }
      if (deflated) {
        headers["Content-Encoding"] = "deflate"
      }
      if (timestamp) {
        headers["Expires"] = new Date().toUTCString()
        headers["Last-Modified"] = timestamp
      }
      response.writeHead(status, headers)
      response.end(content)
    },

    Http = module.exports = class extends PreCore.classes.Tree {

      create(params) {
        super.create(params)
         const {parent, port, https, options} = this,
            {home} = core,
            {deflatable} = Http,
            {clientSource} = parent,
            protocol = require(https ? "https" : "http"),
            server = this.server = protocol.createServer(options, (request, response) => {
              const {mimes} = this
              console.log({mimes})
              if (request.method === "POST") {
                let result = ""
                request.on("data", data => {
                  result += data
                })
                request.on("end", () => {
                  httpWrite(response, 200, "")
                  const value = JSON.parse(result),
                      handler = request.url.substr(1)
                  this[handler](value)
                })
                return
              }


              let [path, id] = request.url.split("?")
              path = path === "/" || path === "/qr" ? "/index.html" : path
              const {paths, timestamps} = clientSource,
                  index = path.lastIndexOf("."),
                  ext = path.substr(index + 1),
                  mime = mimes[ext]

              //     console.log("REQUEST", path)
              const content = paths[path]
              if (mime === undefined || content === undefined) {
                return httpWrite(response, 404, "Not found")
              }

              const timestamp = new Date(timestamps[path]).toUTCString()
              let lastModified = request.headers["if-modified-since"]
              if (lastModified) {
                if (lastModified === timestamp) {
                  //    return httpWrite(response, 304, "Not modified")
                }
              }

              httpWrite(response, 200, content, mime, deflatable[ext], timestamp)
            })

        server.on("error", err => console.log("ERROR", err))
        server.listen(port, (err) => {
          if (err) {
            return console.log("ERROR", err)
          }

          console.log(`server is listening on ${port}`)
        })
      }

      log(params) {
        console.log("+-".repeat(50))
        console.log(params)
      }

      release() {
        super.release()
        this.server.close()
      }
    }

Http.deflatable = {
  html: true,
  css: true,
  js: true,
}
