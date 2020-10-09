const WS = require("ws")
module.exports = class WebSocket extends PreCore.classes.Tree {

  create(params) {
    super.create(params)

    const links = this.links = {}
    const ws = this.server = new WS.Server({server: this.parent.http.server});

    let index = 0
    ws.on('connection', (socket, request) => {
      const [role, code] = request.url.substr(1).split("?"),
          codeObj = links[code] = links[code] || {links: {}},
          codeLinks = codeObj.links,
          id = socket.id = index++

      console.log({role, code})
      socket.code = code
      socket.role = role
      if (role === "host") {
        codeObj.host = socket
      } else {
        codeObj.host.send(PreCore.toSource({connected: true}))
      }
      codeLinks[id] = socket

      socket.on('message', data => {
        this.broadcast(code, socket, data)
        console.log(data)
      })
    })

    ws.on("close", data => {
      console.log("CLOSE")
    })

    console.log("listening to websockets")
  }

  broadcast(code, transmitter, message) {
    const codeObj = this.links[code]
    if (codeObj === undefined) {
      return
    }
    const {links} = codeObj
    for (const id in links) {
      const socket = links[id]
      if (socket === transmitter) {
        continue
      }
      if (socket.readyState === WS.OPEN) {
        socket.send(message)
      }
    }
  }
}
