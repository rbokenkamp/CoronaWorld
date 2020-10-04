module.exports = {
  dataPath: {
    type: "Path",
    defaultValue: "",
  },
  level: {
    type: "Integer",
    defaultValue: 0,
  },
  columns: {
    type: "Collection",
    item: "Column",
    defaultValue: {},
  },
  nodes: {
    type: "Collection",
    item: "Display",
    defaultValue: {},
  },
}

