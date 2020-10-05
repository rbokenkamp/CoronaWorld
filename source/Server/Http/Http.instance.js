module.exports = {
  port: {
    type: "Integer",
    defaultValue: 3000,
  },
  server: {
    type: "Branch",
    internal: true,
  },
  https: "Boolean",
  options: "Branch",
  /*
  options: {
    type: "Hash",
    branches: {
      cert: "Buffer",
      key: "Buffer",
    }
  }

   */
}
