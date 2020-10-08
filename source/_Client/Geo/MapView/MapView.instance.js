module.exports = {
  x: {
    type: "Real",
    defaultValue: 0,
  },
  y: {
    type: "Real",
    defaultValue: 0,
  },
  scale: {
    type: "Real",
    defaultValue: 1,
  },
  viewSize: {
    type: "Real",
    defaultValue: 1,
  },
  viewScale: {
    type: "Real",
    internal: true,
  },
  value: {
    type: "Text",
    updatable: true,
  },
  paths: {
    type: "List",
    internal: true,
  },

}

