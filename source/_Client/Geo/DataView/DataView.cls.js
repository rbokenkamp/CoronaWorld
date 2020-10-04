module.exports = class DataView extends PreCore.classes.Widget {

  run() {
    this.initData2()
  }

  initData2() {
    const {level, dataPath} = this

    const branches = 0

    if (level === 0) {
      console.log(this.nodes)
      this.nodes.setItem("test", {type: "DataValue"})
    }
  }

  initPath(current, processed, info) {
    const {node} = this,
        {isObject} = PreCore,
        result = {},
        id = current.__instance ? current.__instance.id : current.id

    processed[id] = info

    for (const key in current) {
      const keyNode = Dom.create({parent: node, tag: "text", attributes: {x: 100, y: 100}})
      Dom.set(keyNode, key)
      const value = current[key]
      if (isObject(value)) {
        const childId = value.__instance ? value.__instance.id : value.id
        if (childId === undefined) {
          continue
        }
        if (childId in processed) {
          result[key] = [keyNode, undefined, childId]
          continue
        }
        const info = result[key] = [keyNode, undefined, childId, undefined]
        info[3] = this.initPath(current[key], processed,)
        continue
      }

      const valueNode = Dom.create({parent: node, tag: "text", attributes: {x: 100, y: 100}})
      Dom.set(valueNode, ("" + value).substr(0, 50))
      result[key] = [keyNode, valueNode]
    }
    return result
  }

  initData() {
    const {dataPath} = this,
        current = core.get(dataPath),
        processed = {}
    const data = this.data = this.initPath(current, processed)
    const levels = this.levels = []

    this.calculateLevels(data, 0)
    console.log("@@@ levels @@@", levels)
  }

  calculateLevels(data, level) {
    const {levels} = this
    if (level + 1 > levels.length) {
      levels.push({items: 0, width: 0, nodes: []})
    }
    const levelInfo = levels[level]
    let {items, width} = levelInfo

    if (level + 2 > levels.length) {
      levels.push({items: 0, width: 0, nodes: []})
    }
    const valueInfo = levels[level + 1]

    for (const key in data) {
      const [keyNode, valueNode, id, branches] = data[key],
          keyWidth = keyNode.getBBox().width

      levelInfo.width = width = keyWidth > width ? keyWidth : width
      levelInfo.items = items = ++items

      if (valueNode) {
        const valueWidth = valueNode.getBBox().width
        valueInfo.width = width = valueWidth > width ? valueWidth : width
        valueInfo.items = items = ++items
        if (valueWidth > 1000) {
          console.log(keyNode, valueWidth, valueNode.innerHTML)
        }
        continue
      }
      if (branches === undefined) {
        continue
      }

      this.calculateLevels(branches, level + 1)
    }
  }

  drawLevel(data, level) {
    console.log("+++", data, level)
    for (const key in data) {
      //   const [ke]
    }
  }

  draw() {
    this.drawLevel(this.data, 0)
  }


}
