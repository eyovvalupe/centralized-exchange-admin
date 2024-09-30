import request from '/@/api/request'

/**
 * 用户报表汇总
 * @param {*} data
 * @returns
 */
export function apiCollect (data) {
  return request({
    method: 'post',
    url: '/anon/v1/user/report/collect',
    data
  })
}

/**
 * 用户报表币种分类
 * @param {*} data
 * @returns
 */
export function apiSymbolCategory (data) {
  return request({
    method: 'post',
    url: '/anon/v1/user/report/symbolCategory',
    data
  })
}

/**
 * 用户报表游戏分类
 * @param {*} data
 * @returns
 */
export function apiGameCategory (data) {
  return request({
    method: 'post',
    url: '/anon/v1/user/report/gameCategory',
    data
  })
}
