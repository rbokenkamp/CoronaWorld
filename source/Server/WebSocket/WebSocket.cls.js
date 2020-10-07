const WS = require("ws")
module.exports = class WebSocket extends PreCore.classes.Tree {

  create(params) {
    super.create(params)

    this.links = {}
    const ws = this.server = new WS.Server({ server: this.parent.http.server });

    ws.on('connection', (socket, request) => {
      console.log("CONNECTED")
      console.log(request.url)
      const [name, key] = request.url.substr(1).split("?")
      this.links[key] = socket

      socket.on('message', data => {
        console.log(data)
       })
     })

    ws.on("close", data => {
      console.log("CLOSE")
    })

    console.log("listening to websockets")
  }

  broadcast(message) {
    this.server.clients.forEach(socket => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message)
      }
    });

  }
}
