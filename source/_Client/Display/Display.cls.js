const Display = module.exports = class Display extends PreCore.classes.Tree {

  create(params) {
    super.create(params)
    if (params.type === "DataValue") {
      //   debugger
    }
    let {type, parentNode} = params,
        parent = this.getDisplayParent(params.parent)

    parentNode = parentNode ? parentNode : (parent && parent.node ? parent.node : document.body)

    const template = PreCore.templates[type]
    if (template) {
      this.setTemplate(params, parentNode, template, params.node)
    }

    let {tag, dataPath, node} = this
    if (node === undefined) {
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

  }

  init(params) {
    setTimeout(() => this.draw())
  }

  parseTemplate(params, node) {
    const {types} = PreCore
    for (const child of node.children) {
      const childParams = Dom.getParams(child),
          {key, type} = childParams

      if (type && key) {
        const metas = types[params.type].instance
        if (key in metas === false) {
          this.raise("tree_unknown_param", {path: this.path + "/" + key})
        }
        childParams.node = child
        params[key] = childParams
        continue
      }
       this.parseTemplate(params, child)
    }
  }

  setTemplate(params, parentNode, template, templateNode) {
    if (templateNode) {
      templateNode.innerHTML = template
      const node = templateNode.children[templateNode.children.length - 1]
      templateNode.removeChild(node)
      templateNode.innerHTML = node.innerHTML
    } else {
      parentNode.insertAdjacentHTML("beforeend", template)
      const node = this.node = parentNode.children[parentNode.children.length - 1]
    }

    this.parseTemplate(params, this.node)
  }

  getDisplayParent(current) {
    while (current) {
      if (PreCore.instanceOf(current, "Display")) {
        return current
        continue
      }
      current = current.parent
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
        const value = vars[key]
        Dom.set(child, value === undefined ? "" : value)

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
