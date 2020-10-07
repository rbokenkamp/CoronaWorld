module.exports = {
  home: "Path",
  paths: {
    type: "Collection",
    item: "Path",
    internal: true,
  },
  disc: {
    type: "ServerDisc",
    internal: true,
  },
  clientSource: {
    type: "ClientSource",
    defaultValue: {},
  },
   http: {
    type: "Http",
    defaultValue: {},
  },
  ws: {
    type: "WebSocket",
    defaultValue: {},
  }

}
