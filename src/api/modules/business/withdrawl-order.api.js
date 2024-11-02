import request from '/@/api/request'

/**
 * 修改订单状态
 * @param {*} data
 * @returns
 */
export function apiDepositCheck( data ) {
  return  request( {
    method : 'post',
    url : '/roles/v1/withdraw/m/check',
    data : data
  })
}

/**
 * 提现记录
 * @param {*} data
 * @returns
 */
export function apiWithdrawRecord( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/withdraw/q/list',
    data
  })
}

export function apiWithdrawAccount( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/withdraw/q/account',
    data
  })
}

export function apiStocksLock( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/stock/m/lock',
    data
  })
}
export function apifuturesLock( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/m/lock',
    data
  })
}

