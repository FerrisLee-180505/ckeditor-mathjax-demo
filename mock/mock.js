// 本文件被 node 使用，请勿使用 export/import
const Mock = require('mockjs')

const { Random } = Mock

/**
 * 查询工具类，用于在内存数组中查找符合条件的列表
 * @param {array} db
 * @param {number} limit 每页数量
 */
function Search(db, limit) {
  this.db = db || []
  this.limit = limit || 10
}
/**
 * 过滤器
 */
Search.prototype.filter = function (val, callback) {
  if (!callback) {
    callback = val
    this.db = this.db.filter(callback)
  } else {
    if (typeof val === 'string') {
      val = val.trim()
    }
    if (callback) {
      if (val !== undefined && val !== '') {
        this.db = this.db.filter(callback)
      }
    }
  }
  return this
}
/**
 * 排除一些字段输出
 */
Search.prototype.exclude = function (...keys) {
  this.db = this.db.map((item) => {
    item = { ...item }
    keys.forEach((key) => {
      delete item[key]
    })
    return item
  })
  return this
}
/**
 * 输出分页结果
 */
Search.prototype.pagination = function ({ offset, limit }) {
  offset = parseInt(offset, 10) || 0
  limit = parseInt(limit, 10) || this.limit

  let db = this.db
  const total = db.length
  const start = Math.max(0, offset)
  const end = Math.min(limit + offset, total)

  db = db.slice(start, end)
  return {
    limit,
    offset: end,
    total,
    data: db
  }
}
/**
 * 返回结果数组
 */
Search.prototype.run = function () {
  return this.db
}

/**
 * 在数组中查找
 * @param {array} arr
 * @param {any} id 某个值
 * @param {string} key 键名
 */
function find(arr, id, key = 'id') {
  let index; let
    item
  for (let i = 0; i < arr.length; i++) {
    // eslint-disable-next-line
    if (arr[i][key] == id) {
      index = i
      item = arr[i]
      break
    }
  }
  return {
    match: index !== undefined,
    index,
    data: item
  }
}

/**
 * 辅助 koa 输出异常
 * @param {Koa} ctx
 * @param {string} message 错误文本信息
 * @param {number} code HTTP 错误码
 */
function raise(ctx, message, code = 500) {
  ctx.status = code
  return {
    message
  }
}

/**
 * 输出一个乱序的数组
 * @param {arrya} arr
 */
function shuffle(arr) {
  const length = arr.length
  let index
  for (let i = length - 1; i; i--) {
    index = Math.floor(Math.random() * i)
    arr[i] = arr.splice(index, 1, arr[i])[0]
  }
  return arr
}

/**
 * 初始化一个长度为 count 的数组，用 0 填充
 * @param {number} count
 */
function initArray(count) {
  return new Array(count).fill(0)
}

/**
 * 经典增删改查
 * @param {string} name 命名空间
 * @param {array} db mock 的数据集
 * @param {string} key 主键名，默认 id
 */
function Classic(name, db, key = 'id') {
  this.name = name
  this.db = db
  this.key = key
}

/**
 * 创建一条数据
 */
Classic.prototype.create = function (callback) {
  return async (ctx) => {
    let data = ctx.request.body
    data[this.key] = Random.id()
    if (callback) {
      data = callback.call(this, data)
    }
    this.db.unshift(data)
    return data
  }
}

/**
 * 更新一条数据
 */
Classic.prototype.update = function (callback) {
  return async (ctx, id) => {
    const result = find(this.db, id, this.key)
    const { match, index } = result
    if (!match) {
      return raise(ctx, `${name}:${id} not found`)
    }
    let data = Object.assign(result.data, ctx.request.body)
    if (callback) {
      data = callback.call(this, data)
    }
    this.db[index] = data
    return this.db[index]
  }
}

/**
 * 获取一条数据
 */
Classic.prototype.retrieve = function (callback) {
  return async (ctx, id) => {
    const result = find(this.db, id, this.key)
    if (!result.match) {
      return raise(ctx, `${name}:${id} not found`)
    }
    let data = result.data
    if (callback) {
      data = callback.call(this, data)
    }
    return data
  }
}

/**
 * 删除一条数据
 */
Classic.prototype.delete = function () {
  return async (ctx, id) => {
    const { match, index } = find(this.db, id, this.key)
    if (match) {
      this.db.splice(index, 1)
    }
    return {}
  }
}

module.exports = {
  /**
   * 模拟延时，可以被 await
   * @param {number} ms 毫秒
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },
  /**
   * 在数组中查找，数组的元素有 id 属性
   * @param {array} arr
   * @param {number|string} id
   */
  find,
  /**
   * 为 koa 抛出异常
   * @param {Koa} ctx
   * @param {string} message
   * @param {number} code HTTP 状态码，默认 500
   */
  raise,
  /**
   * 数组乱序
   */
  shuffle,
  /**
   * 初始化一个长度为 n 的数组，每个元素用 0 填充
   */
  initArray,
  /**
   * 搜索
   */
  Search,
  /**
   * 快速创建经典的增删改接口（查询因为会根据条件变化较大，不纳入）
   * @param {string} name 目标
   * @param {array} db mock 存储
   * @param {string} key 主键名
   */
  classic(name, db, key = 'id') {
    const crud = new Classic(name, db, key)

    return {
      [`POST /${name}`]: crud.create(),
      [`GET /${name}/:id`]: crud.retrieve(),
      [`PUT /${name}/:id`]: crud.update(),
      [`DELETE /${name}/:id`]: crud.delete()
    }
  },
  Classic
}
