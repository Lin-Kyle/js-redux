// 纯函数修改
function arNum (state, action) {
  switch (action.type) {
    case 'ADD':
      return state + 1
    case 'REDUCE':
      return state - 1
    // 默认返回原值
    default:
      return state
  }
}

// 纯函数修改
function mdNum (state, action) {
  switch (action.type) {
    case 'MULTIPLY':
      return state * 2
    case 'DIVIDE':
      return state / 2
    // 默认返回原值
    default:
      return state
  }
}

const reducers = combineReducers({
  arNum,
  mdNum
})
