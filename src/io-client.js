const s = document.createElement('script')
s.src = '//cdn.jsdelivr.net/npm/socket.io-client@2.2.0/dist/socket.io.slim.js'

s.onload = () => {
  const socket = window.io(
    'http://127.0.0.1:%port%', {
      transports: ['websocket', 'polling', 'flashsocket']
    }
  )
  // 默认需要同步的参数信息
  let socketData = {
    // 通过服务端修改状态, 防止出现死循坏
    sync: true
  }

  // 监听来自服务器的事件推送
  socket.on('event of click', options => {
    socketData = options
    const { type, nodeName, index } = options
    const node = document.querySelectorAll(nodeName)[index]
    if (node) {
      // ! 某些场景下会失效
      // const ev = document.createEvent('HTMLEvents')
      // ev.initEvent(type, true, true)
      // node.dispatchEvent(ev)
      node.click()
    }
    socketData = {
      sync: true
    }
  })
  socket.on('event of scroll', options => {
    socketData = options
    const { x, y, nodeName, index } = options
    const node = document.querySelectorAll(nodeName)[index]
    if (node) {
      node.scrollTo(x, y)
    }
    socketData = {
      sync: true
    }
  })

  // 点击事件同步
  document.addEventListener('click', e => {
    if (socketData.sync) {
      const { target, type } = e
      const { nodeName } = target
      const params = {
        type,
        nodeName
      }
      const allNodes = [...document.querySelectorAll(nodeName)]
      allNodes.some((node, i) => {
        if (target === node) {
          params.index = i
          return true
        }
        return false
      })
      socket.emit('event of click', params)
    }
  }, true)
  // 滚动事件同步
  document.addEventListener('scroll', e => {
    if (socketData.sync) {
      const { target, type } = e
      const targetNode = target.scrollingElement || target
      const { nodeName, scrollLeft: x, scrollTop: y } = targetNode
      const params = {
        type,
        nodeName,
        x,
        y
      }
      const allNodes = [...document.querySelectorAll(nodeName)]
      allNodes.some((node, i) => {
        if (targetNode === node) {
          params.index = i
          return true
        }
        return false
      })
      socket.emit('event of scroll', params)
    }
  }, true)
}
document.head.appendChild(s)
