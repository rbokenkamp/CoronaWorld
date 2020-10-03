const params = {
  test: 17
}

Object.defineProperty(params, "test", {
  enumerable: false,
});

console.log(params)

params.test = 18
