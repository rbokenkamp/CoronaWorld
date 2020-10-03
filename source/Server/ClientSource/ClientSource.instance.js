module.exports = {
  scssIncludePaths: {
    type: "List",
    item: "Path",
  },
  paths: {
    type: "Collection",
    item: "Path",
    internal: true,
  },
  timestamps: {
    type: "Collection",
    item: "Real",
    internal: true,
  },
  data: {
    type: "Branch",
    internal: true,
  },
  watches: {
    type: "List",
    internal: true,
  },
}
