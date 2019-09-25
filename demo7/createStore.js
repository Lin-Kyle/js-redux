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
  let listenList = []
  // 监听队列浅拷贝
  let nextListeners = listenList
  // 是否dispatch中
  let isDispatching = false

  // 浅拷贝
  function ensureCanMutateNextListeners () {
    if (nextListeners === listenList) {
      nextListeners = listenList.slice()
    }
  }

  // 唯一获取数据函数
  function getState () {
    // 输出警告
    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing. ' +
          'The reducer has already received the state as an argument. ' +
          'Pass it down from the top reducer instead of reading it from the store.'
      )
    }
    return state
  }

  // 纯函数来执行修改,只返回最新数据
  const dispatch = (action) => {
    // 严格控制dispatch,不得中途再次发送
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    // 增加意外防止操作
    try {
      isDispatching = true
      state = reducer(state, action)
    } finally {
      isDispatching = false
    }

    // 获取更改后的数据同时获取最新队列
    const listeners = (listenList = nextListeners)
    // 替换成原始遍历提高性能,遍历触发事件
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    // 为了方便将action原样返回
    return action
  }

  // 添加监听器, 同时返回解绑该事件的函数
  const subscribe = (fn) => {
    if (isDispatching) {
      throw new Error(
        'You may not call store.subscribe() while the reducer is executing. ' +
          'If you would like to be notified after the store has been updated, subscribe from a ' +
          'component and invoke store.getState() in the callback to access the latest state. '
      )
    }

    // 占位标记
    let isSubscribed = true
    // 每次添加监听事件时浅拷贝最新队列
    ensureCanMutateNextListeners()
    nextListeners.push(fn)

    return function unsubscribe () {
      if (!isSubscribed) {
        return
      }

      if (isDispatching) {
        throw new Error(
          'You may not unsubscribe from a store listener while the reducer is executing. '
        )
      }
      isSubscribed = false
      // 每次移除监听事件时浅拷贝最新队列
      ensureCanMutateNextListeners()
      // 根据索引值删除比filter过滤重新赋值效率高
      const index = nextListeners.indexOf(fn)
      nextListeners.splice(index, 1)
      listenList = null
    }
  }

  // 默认触发一次dispatch以获取各个reduce的初始数据
  dispatch({
    type: `@@redux/INIT${Math.random()
      .toString(36)
      .substring(7)
      .split('')
      .join('.')}`
  })

  return {
    getState,
    dispatch,
    subscribe
  }
}
