function createStore (initStore = {}, reducer) {
  // 唯一数据源
  let state = initStore

  // 唯一获取数据函数
  const getState = () => state

  // 纯函数来执行修改,只返回最新数据
  const dispatch = (action) => {
    state = reducer(state, action)
  }

  return {
    getState,
    dispatch
  }
}
