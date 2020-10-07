const Display = module.exports = class Display extends PreCore.classes.Tree {

  create(params) {
    super.create(params)
    if (params.type === "DataValue") {
      //   debugger
    }
    let {type, parentNode} = params,
        parent = this.getDisplayParent(params.parent)

    parentNode = parentNode ? parentNode : (parent && parent.node ? parent.node : document.body)

    let {tag, dataPath, node} = this
    if (node === undefined) {
      this.node = Dom.create({
        parent: parentNode,
        tag: tag || "div",
      })
    }
    node = this.node
    node.__display = this

    if (node.children.length) {
      this.parseTemplate(params, node)
    } else {
      const template = PreCore.templates[type]
      if (template) {
        this.setTemplate(params, template)
      }
    }

    const types = this.getTypes()
    Dom.setTypes(node, types)
    Dom.setAttributes(node, {"id": "d" + this.id})
  }


  build(params) {
 //   console.log(params.key, "BEFORE CREATE")
    this.create(params)
 //   console.log(this.path, "AFTER CREATE")
    this.init && this.init(params)
//    console.log(this.path, "AFTER INIT")
    this.created(params)
 //   console.log(this.path, "AFTER CREATED")
  }

  init(params) {
    // this.refresh()
  }

  parseTemplate(params, node) {
    const {types} = PreCore
    for (const child of node.children) {
      const childParams = Dom.getParams(child),
          {key, type} = childParams

      if (type && key) {
        const metas = types[this.type].instance
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

  setTemplate(params, template) {
    const {node} = this

    node.innerHTML = template
    this.parseTemplate(params, node)
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
    const types = this.types ? this.types: []
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

  refresh(handler) {
    if (this.drawTimeout) {
      return
    }
    this.drawTimeout = setTimeout(() => {
      this.draw()
      delete this.drawTimeout
      handler && handler()
    }, 100)

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
