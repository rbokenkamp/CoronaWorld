let Buffer
{
  const textDecoder = new TextDecoder("utf8")

  Buffer = class {

    constructor(value) {
      this.value = new Uint8Array(value)
      this.length = value.length
    }

    toString(encoding) {
      if (encoding === "hex") {
        return this.value.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
      }
      return textDecoder.decode(this.value) // utf8
    }
  }

  Buffer.from = (value, encoding) => {
    if (encoding === "utf8") {
      const encoder = new TextEncoder()
      value = encoder.encode(value)
    } else if (encoding === "hex") {
      if (value === "") {
        return new Uint8Array()
      }
      value = new Uint8Array(value.match(/../g).map(byte => parseInt(byte, 16)))
    }
    return new Buffer(value)
  }
}
