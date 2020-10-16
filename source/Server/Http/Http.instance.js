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
  mimes: {
    type: "Branch",
    defaultValue: {
      html: "text/html",
      css: "text/css",
      js: "text/javascript",
      png: "image/png",
      jpg: "image/jpg",
      gif: "image/gif",
      mp4: "video/mp4",
      map: "application/octet-stream",
    }
  }
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
