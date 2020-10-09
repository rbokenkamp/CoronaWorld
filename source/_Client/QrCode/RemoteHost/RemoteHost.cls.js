

const RemoteHost = module.exports = class RemoteHost extends PreCore.classes.RemoteRole {

  create(params) {
    super.create(params)
    const {code, parent} = this

    const url = this.url = "ws://" + location.host + "/host?" + code,
        socket = this.socket = new WebSocket(url)

    socket.addEventListener('message', ({data}) => {
      console.log('@@@ ', data);
      data = JSON.parse(data)
      if (data.connected) {
        return parent.qrCode && parent.qrCode.release()
      }
      this.handleMessage(data)
     })

    this.setListeners()

  }

}
