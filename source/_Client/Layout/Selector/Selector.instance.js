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
  displayWidth: "Integer",
  displayHeight: "Integer",
  marker: "Display",
  value: {
    type: "Real",
    defaultValue: 0,
  },
  steps: {
    type: "Integer",
    defaultValue: 11,
  },
  startValue: {
    type: "Real",
    internal: true,
  }
}
