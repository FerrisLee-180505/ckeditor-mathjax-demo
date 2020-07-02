/**
* 顺序执行Promise，并返回结果
* @param {返回promise的函数集合} promises
* @param {每一步的回调函数，非异步,可以考虑后期支持} cb
* @param {附加参数} args
*/
function sequence(promises, cb, ...args) {
  const p = Promise.resolve(),
    len = promises.length
  if (len <= 0) {
    return p
  }
  let i = 0
  //如果cb不是函数
  if (typeof cb !== 'function') {
    cb = null
    args = [cb, ...args]
  }

  function callBack(...params) {
    return p.then(r => {
      return promises[i](r, ...params)
    }).then(r => {
      ++i
      cb && cb(r, i, ...params)
      return i > len - 1 ? Promise.resolve(r) : callBack(...params)
    })
  }

  return callBack(...args)
}
const scriptPromise = (url) => new Promise((resolve, reject) => {
  try {
    $.getScript(url).done(() => {
      resolve()
    })
  } catch (error) {
    reject()
  }
})

export {
  sequence, scriptPromise
}