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
  zIndexable: {
    type: "Boolean",
    defaultValue: true,
  },
  closable: {
    type: "Boolean",
    defaultValue: true,
  },
  selected: "Boolean",
  focussed: {
    type: "Boolean",
    required: true,
    defaultValue: false,
  },
  item: "Display",
}

