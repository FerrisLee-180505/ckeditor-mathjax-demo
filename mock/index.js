const Mock = require('mockjs')
const { sleep, raise } = require('./mock')

const { Random, mock } = Mock

module.exports = {
  // url 前缀
  prefix: 'demo',
  data: {
    'GET /user/:id': async (ctx, id) => {
      id = parseInt(id, 10)
      // 模拟服务端异常
      if (id === 0) {
        return raise(ctx, 'id should not be zero')
      }
      // 模拟延时
      if (ctx.query.sleep) {
        await sleep(ctx.query.sleep)
      }
      // 模拟正常返回
      return mock({
        id,
        name: Random.first(),
        email: Random.email()
      })
    },
    'POST /user': () => mock({
      id: Random.id(),
      name: Random.first(),
      email: Random.email()
    })
  }
}
