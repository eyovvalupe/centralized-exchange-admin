import request from '/@/api/request'
/**
 * 充值记录
 * @param {*} data
 * @returns
 */
export function apiDepositRecord( data ) {
  return  request( {
    method : 'post',
    url : '/roles/v1/deposit/q/list',
    data : data
  })
}
export function apiDepositCheck( data ) {
  return  request( {
    method : 'post',
    url : '/roles/v1/deposit/check',
    data : data
  })
}
export function apiAddress( data ) {
  return  request( {
    method : 'post',
    url : '/roles/v1/deposit/fields',
    data : data
  })
}
