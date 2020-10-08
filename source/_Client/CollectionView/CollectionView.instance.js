module.exports = {
  dataPath: {
    type: "Path",
    defaultValue: "",
  },
  items: {
    type: "Collection",
    item: "Display",
    defaultValue: {},
  },
  itemType: {
    type: "Text",
    required: true,
  },
  data: {
    type: "Branch", //@@@ TODO make this List
    internal: true,
  },
  scrollIndex: {
    type: "Integer",
    internal: true,
  }
}

