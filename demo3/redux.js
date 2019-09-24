function createStore (initStore = {}, reducer) {
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
