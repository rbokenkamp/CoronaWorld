const RemoteRole = module.exports = class RemoteRole extends PreCore.classes.Tree {

  setListeners() {
    const {socket} = this
    this.listen({event: "set", path: "/app/layout/selectedCountry", originator: undefined}, ({value}) => {
      socket.send(JSON.stringify({"/app/layout/selectedCountry": value}))
    })
    this.listen({event: "set", path: "/app/layout/aspect", originator: undefined}, ({value}) => {
      socket.send(JSON.stringify({"/app/layout/aspect": value}))
    })

  }

  handleMessage(data) {
    const {paths} = RemoteRole
    for (const path in data) {
      if (path in paths === false) {
        return console.error("Invalid remote path", path)
      }
      core.set(data[path], path, "remote")
    }

  }

  release() {
    this.socket.close()
  }

}

RemoteRole.paths = {
  "/app/layout/selectedCountry": true,
  "/app/layout/aspect": true,
}
