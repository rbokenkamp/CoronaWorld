module.exports = {
  type: {
    type: "Text",
    required: true,
  },
  parent: {
    type: "Link",
  },
  key: {
    type: "Text",
    required: true,
  },
  path: {
    type: "Path",
    required: true,
  },
  id: {
    type: "Integer",
    required: true,
  },
}
