// 接收中间件数组
function applyMiddleware (...middlewares) {
  // 接收createStore函数和reducer和其他参数
  return (createStore) => (reducer, ...args) => {
    // 这就是原始的实例化store,所以applyMiddleware方法其实就是围绕在原始store的基础上添加功能
    const store = createStore(reducer, ...args)

    // 先初始化dispatch方法占位,但是此时执行会抛出异常
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    /**
     * 构建中间件第一层运行的入参对象, 保证每个中间件都是一样的参数条件,所以上面的抛出异常也是如此
     * applyMiddleware([
        f1(middlewareAPI) => s1(next) => t1(...arg)
        fn(middlewareAPI) => sn(next) => tn(...arg)
     * ])
     *
     */
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }

    // 遍历运行每个中间件返回新的数组
    // chain = [s1(next) => t1(...arg), ...sn(next) => tn(...arg)]
    const chain = middlewares.map((middleware) => middleware(middlewareAPI))

    /* 返回增强功能后的dispatch方法
    dispatch = (s1(sn(next) => tn(...arg))()) => t1(...arg))(store.dispatch) */
    dispatch = compose(...chain)(store.dispatch)

    // 替代原始的store对象
    return {
      ...store,
      dispatch
    }
  }
}
