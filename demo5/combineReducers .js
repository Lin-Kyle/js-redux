function combineReducers (reducers) {
  // 获取索引值
  const reducerKeys = Object.keys(reducers)
  // 最终返回的reducer对象
  const finalReducers = {}
  // 筛选索引值对应的函数类型才赋值到最终reducer对象
  reducerKeys.forEach((key) => {
    if (typeof reducers[key] === 'function') finalReducers[key] = reducers[key]
  })
  // 获取最终reducer对象索引值
  const finalReducerKeys = Object.keys(finalReducers)

  // 返回给store初始化使用的分发函数
  return function (state = {}, action) {
    // 是否改变和新的state
    let isChange = false
    const nextState = {}
    // 遍历触发对应分发器
    finalReducerKeys.forEach((key) => {
      // 当阶段数据
      const oldState = state[key]
      // 分发器处理后最新数据
      const newState = finalReducers[key](oldState, action)
      nextState[key] = newState
      // 对比前后数据是否一致
      isChange = isChange || oldState !== newState
    })
    // 检测分发器处理后阶段的数据值有没发生变化
    isChange = isChange || finalReducerKeys.length !== Object.keys(state).length
    return isChange ? nextState : state
  }
}
