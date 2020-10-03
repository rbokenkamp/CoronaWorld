const params = {
  test: 17
}

Object.defineProperty(params, "test", {
  enumerable: false,
});

console.log(params)

params.test = 18




global.x = (global.x || 0) + 1
if (x === 266) {
  debugger
}

