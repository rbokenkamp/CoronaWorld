module.exports = {
  extend: "Text",
  kind: {
    type: "Choice",
    choices: ["Branch", "Collection", "Tree", "Data", "Hash"],
    required: true,
  },
  cls: {
    type: "Class",
    required: true,
  },
  errors: {
    type: "Collection",
    item: "Text",
  },
  metas: {
    type: "Collection",
    item: "Meta",
  },
  instance: {
    type: "Collection",
    item: "Meta",
  },
}
