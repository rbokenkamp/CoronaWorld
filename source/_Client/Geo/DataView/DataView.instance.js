module.exports = {
  dataPath: {
    type: "Path",
    defaultValue: "",
  },
  level: {
    type: "Integer",
    defaultValue: 0,
  },
   nodes: {
    type: "Collection",
    item: "DataValue",
    defaultValue: {},
  },
}

