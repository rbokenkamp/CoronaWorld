const Display = module.exports = class Display extends PreCore.classes.Tree {

  create(params, options) {
    super.create(params, options)
    let {type, parentNode, tag, dataPath, node} = this
    const parent = this.getDisplayParent()
    parentNode = parentNode ? parentNode : (parent && parent.node ? parent.node : document.body)
    const template = PreCore.templates[type]
    if (template) {
      this.setTemplate(parentNode, template)
    } else if (node === undefined) {
      this.node = Dom.create({
        parent: parentNode,
        tag: tag || "div",
      })
    }
    node = this.node
    node.__display = this
    const types = this.getTypes()
    Dom.setTypes(node, types)
    Dom.setAttributes(node, {"id": "d" + this.id})

    if (dataPath) {
      Dom.set(node, core.get(dataPath))
    }
  }

  init(params) {
    this.draw()
  }

  setTemplate(parentNode, template) {
    parentNode.insertAdjacentHTML("beforeend", template)
    this.node = parentNode.children[parentNode.children.length - 1]

  }

  getDisplayParent() {
    let current = this
    while (true) {
      const {parent} = current
      if (parent === undefined) {
        return
      }
      if (parent.__inner) {
        current = parent.__inner.parent
        continue
      }
      return parent
    }
  }

  setStyle(css) {
    if (css === undefined && this.style) {
      this.style.remove()
      delete this.style
    }
    if ("style" in this === false) {
      this.style = Dom.create({parent: document.head, tag: "style", attributes: {"data-key": "d" + this.id}})
    }
    Dom.set(this.style, css)
  }

  getTypes() {
    const types = []
    let type = this.type
    while (true) {
      types.unshift(type)
      if (type === "Display") {
        return types
      }
      type = core.types[type].extend
    }
  }

  draw() {
  }

  setVars(vars) {
    const {node} = this
    for (const key in vars) {
      const child = node.querySelector(`.data-${key}`)
      if (child) {
        Dom.set(child, vars[key])

      } else {
        this.raise("display_var_not_found", {path: this.path, key})
      }
    }
  }

  release() {
    super.release()
    this.node.remove()
    if (this.style) {
      this.style.remove()
    }
  }

  static htmlEntities(value) {
    return value.replace(/[\u00A0-\u9999<>\&]/gim, s => {
      return '&#' + s.charCodeAt(0) + ';';
    })
  }

}
