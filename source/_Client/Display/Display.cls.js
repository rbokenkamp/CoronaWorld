const Display = module.exports = class Display extends PreCore.classes.Tree {

  create(params, options) {
    let {type, parentNode} = params,
        parent = this.getDisplayParent(params.parent)

    parentNode = parentNode ? parentNode : (parent && parent.node ? parent.node : document.body)

    const template = PreCore.templates[type]
    if (template) {
      this.setTemplate(params, parentNode, template)
    }

    super.create(params, options)
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

    if (dataPath) {
      Dom.set(node, core.get(dataPath))
    }

  }

  init(params) {
    this.draw()
  }

  parseTemplate(params, node) {
    const {types, limitKeys} = PreCore
    for (const child of node.children) {
      const childParams = Dom.getDataAttributes(child),
          {key, type} = childParams
      if (type && key) {
        const metas = types[params.type].instance
        if (key in metas === false) {
          this.raise("tree_unknown_param", {path: ".../"+key})
        }
        params[key] = limitKeys(childParams, Object.keys(metas[key]))
        continue
      }
      parseTemplate(params, node)
    }
  }

  setTemplate(params, parentNode, template) {
    parentNode.insertAdjacentHTML("beforeend", template)
    const node = this.node = parentNode.children[parentNode.children.length - 1]
    this.parseTemplate(params, node)
    //  for ()

  }

  getDisplayParent(current) {
    while (true) {
      if (current.__instance) {
        current = current.__instance.parent
        continue
      }
      return current
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
