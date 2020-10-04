module.exports = {
  value: {
    type: "Text",
    updatable: true,
  },
  paths: {
    type: "List",
    internal: true,
  },
  x: {
    type: "Integer",
    defaultValue: 0,
  },
  y: {
    type: "Integer",
    defaultValue: 0,
  },
  scale: {
    type: "Real",
    defaultValue: 1,
  },
  viewScale: {
    type: "Real",
    internal: true,
  }
}

