module.exports = class QrCode extends PreCore.classes.Display {

  create(params) {
    super.create(params)
    const {node} = this
    this.canvas = Dom.create({parent: node, tag: "canvas"})
    const code = this.code = "hello"
    this.parent.branch({key: "remoteHost", type: "RemoteHost", code})
 }

   draw() {
    const {canvas, code} = this,
        url = `http://192.168.1.67:3000/qr?${code}`,
        {offsetWidth, offsetHeight} = canvas

    QRCode.toCanvas(canvas, url,
        {width: offsetWidth, height: offsetHeight}
    )
  }
}
