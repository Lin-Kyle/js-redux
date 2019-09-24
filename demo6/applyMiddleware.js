function applyMiddleware (...middlewares) {
  // 接收createStore函数和入参
  return (createStore) => (reducer, ...args) => {
    //把入参拼凑后实例化store
    const store = createStore(reducer, ...args)
    // 先初始化dispatch方法占位,但是此时执行会抛出异常
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    // 构建中间件运行的入参对象, 保证每个中间件都是一样的参数条件,所以上面的抛出异常也是如此
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }

    // 遍历运行每个中间件返回新的数组
    const chain = middlewares.map((middleware) => middleware(middlewareAPI))

    // 返回增强功能后的dispatch方法
    dispatch = compose(...chain)(store.dispatch)

    // 替代原始的store对象
    return {
      ...store,
      dispatch
    }
  }
}
