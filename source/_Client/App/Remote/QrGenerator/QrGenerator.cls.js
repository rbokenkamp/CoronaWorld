module.exports = class QrGenerator extends PreCore.classes.Display {

  create(params) {
    super.create(params)
    const url = this.url = "ws://" + location.host + "/qr?" + "hello" //Date.now()
    // Create WebSocket connection.
    const socket = new WebSocket(url)

// Connection opened
    socket.addEventListener('open', function (event) {
  //    socket.send('Hello Server!');
    });

// Listen for messages
    socket.addEventListener('message', function (event) {
      console.log('Message from server ', event.data);
    });
    console.log(this.node)
  }

  draw() {
    const {node, url} = this,
        {parentNode} = node,
        {offsetWidth, offsetHeight} = parentNode,
        size = offsetWidth > offsetHeight ? offsetHeight : offsetWidth

    this.node.width = innerWidth
    this.node.height = innerHeight

    QRCode.toCanvas(this.node, url
        ,
        {width: size, height: size}
    )
    console.log("DRAW")

  }
}
