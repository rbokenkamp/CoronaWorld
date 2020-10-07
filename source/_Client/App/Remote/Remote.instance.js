module.exports = {
  orientation: {
    type: "Choice",
    choices: ["auto", "horizontal", "vertical"],
    defaultValue: "auto",
  },
  isHorizontal: {
    type: "Boolean",
    internal: true,
  },
  qr: "QrGenerator",
  layout: "Layout",

}
