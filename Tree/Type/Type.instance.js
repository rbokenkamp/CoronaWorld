module.exports = {
  extend: "Text",
  kind: {
    type: "Choice",
    choices: ["Branch", "Collection", "Tree"],
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
  inner: {
    type: "Collection",
    item: "Meta",
  },
}
