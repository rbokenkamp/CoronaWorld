{
  const version = "v0",
      paths = "@@@"

  self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(version).then(cache => cache.addAll(paths)))
  })
}
