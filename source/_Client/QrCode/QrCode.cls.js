module.exports = class QrCode extends PreCore.classes.Display {

  create(params) {
    super.create(params)
    const {node} = this
    this.canvas = Dom.create({parent: node, tag: "canvas"})
    const code = this.code = PreCore.genToken()
    this.parent.branch({key: "remoteHost", type: "RemoteHost", code})
 }

   draw() {
    console.log(location)
    const {canvas, code} = this,
        url = `${location.origin}/qr?${code}`,
        {offsetWidth, offsetHeight} = canvas

    QRCode.toCanvas(canvas, url,
        {width: offsetWidth, height: offsetHeight}
    )
  }
}
