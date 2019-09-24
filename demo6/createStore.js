function createStore (reducer, initStore = {}, enhancer) {
  // 处理一下参数问题
  if (typeof initStore === 'function' && typeof enhancer === 'undefined') {
    enhancer = initStore
    initStore = undefined
  }

  // 劫持enhancer
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
    // 返回包装后的store
    return enhancer(createStore)(reducer, initStore)
  }

  // 唯一数据源
  let state = initStore
  // 监听队列
  const listenList = []

  // 唯一获取数据函数
  const getState = () => state

  // 纯函数来执行修改,只返回最新数据
  const dispatch = (action) => {
    state = reducer(state, action)
    listenList.forEach((listener) => {
      listener(state)
    })
  }

  // 添加监听器, 同时返回解绑该事件的函数
  const subscribe = (fn) => {
    listenList.push(fn)
    return function unsubscribe () {
      listenList = listenList.filter((listener) => fn !== listener)
    }
  }

  return {
    getState,
    dispatch,
    subscribe
  }
}
