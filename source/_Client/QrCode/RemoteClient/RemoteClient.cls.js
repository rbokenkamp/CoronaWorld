module.exports = class RemoteClient extends PreCore.classes.RemoteRole {

  create(params) {
    super.create(params)
    Dom.addType(this.parent.node, "Remote-Client")
    const {code} = this,
        url = this.url = location.origin.replace(/^http/, "ws") + "/client?" + code,
        socket = this.socket = new WebSocket(url)


// Listen for messages
    socket.addEventListener('message', ({data}) => {
      console.log('@@@ ', data);
      data = JSON.parse(data)
      this.handleMessage(data)
    })


    this.setListeners()

  }


  release() {
    Dom.removeType(this.parent.node, "Remote-Client")
    super.release()
  }

}

/*
// Connection opened
    socket.addEventListener('open', function (event) {
      //    socket.send('Hello Server!');
    });


 */
