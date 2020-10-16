const module = {}

const Dom = {
  getAttribute: (node, key) => node.getAttribute(key),
  setAttribute: (node, key, value) => node.setAttribute(key, value),
  setAttributes: (node, params) => {
    for (const key in params) {
      node.setAttribute(key, params[key])
    }
  },
  getAttributes: node => {
    const result = {}
    for (const attributes of node.attributes) {
      const {nodeName, nodeValue} = attributes
      result[nodeName] = nodeValue
    }
    return result
  },
  getDataAttributes: node => {
    const result = {}
    for (const attributes of node.attributes) {
      let {nodeName, nodeValue} = attributes
      if (nodeName.indexOf("data-") === 0) {
        nodeName = nodeName.substr(5).replace(/_(.)/g, (_, c) => c.toUpperCase())
        result[nodeName] = nodeValue
      }
    }
    return result
  },
  getParent: (node, type) => {
    if (node.parentNode === document.body) {
      return
    }
    if (node.classList.contains(type)) {
      return node
    }
    return Dom.getParent(node.parentNode, type)
  },
  getParams: node => {
    const result = {}
    for (const attributes of node.attributes) {
      let {nodeName, nodeValue} = attributes
      if (nodeName.indexOf("params-") === 0) {
        nodeName = nodeName.substr(7).replace(/_(.)/g, (_, c) => c.toUpperCase())
        result[nodeName] = nodeValue
      }
    }
    return result
  },
  getEvent: node => {
    const params = Dom.getDataAttributes(node),
        {event} = params

    if (!event) {
      if (node.parentNode === document.body) {
        return []
      }
      return Dom.getEvent(node.parentNode)
    }

    delete params.event
    let current = node
    while (current !== document.body) {
       const id = Dom.getAttribute(current, "id")
      if (id) {
        const instance = PreCore.instances[id.substr(1)]
        if (event in instance) {
          return [instance, event, params]
        }
      }
      current = current.parentNode
    }
    return []
  },
  set: (node, value) => node.innerHTML = value,
  style: (node, params) => Object.assign(node.style, params),
  hasType: (node, type) => node.classList.contains(type),
  addType: (node, type) => node.classList.add(type),
  toggleType: (node, type, toggle) => node.classList[toggle ? "add" : "remove"](type),
  removeType: (node, type) => node.classList.remove(type),
  setTypes: (node, types) => {
    for (const key of types) {
      node.classList.add(key)
    }
  },
  querySelector: (node, selector) => node.querySelector(selector),
  querySelectorAll: (node, selector) => node.querySelectorAll(selector),
}

Dom.create = ({parent, tag, types, attributes, value, style}) => {
  tag = tag || "div"
  const node = tag in Dom.svgNodes ?
      document.createElementNS("http://www.w3.org/2000/svg", tag) :
      document.createElement(tag)
  parent.appendChild(node)
  if (attributes) {
    Dom.setAttributes(node, attributes)
  }
  if (types) {
    Dom.setTypes(node, types)
  }
  if (style) {
    Dom.style(node, style)
  }
  if (value) {
    Dom.set(node, value)
  }
  return node
}

Dom.svgNodes = {
  line: true,
  svg: true,
  text: true,
  path: true,
  g: true,
  image: true,
  polygon: true,
  circle: true,
}
