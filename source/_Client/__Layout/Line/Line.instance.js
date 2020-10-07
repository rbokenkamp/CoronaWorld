module.exports = {
  tag: {
    type: "Text",
    defaultValue: "line"
  },
  x1: "Real",
  y1: "Real",
  x2: "Real",
  y2: "Real",
  width: {
    type: "Real",
    defaultValue: 1/11,
  },
  widthRelative: {
    type: "Choice",
    choices: ["Width", "Height"],
    defaultValue: "Width",
  }
}
