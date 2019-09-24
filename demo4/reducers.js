// 纯函数修改
function reducers (state, action) {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        count: state.count + 1
      }
    case 'REDUCE':
      return {
        ...state,
        count: state.count - 1
      }
    // 默认返回原值
    default:
      return state
  }
}
