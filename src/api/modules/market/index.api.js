import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/stock/q/list',
    data
  } )
}
export function getDetail(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/stock/q/get',
    data
  } )
}
export function stocksSell(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/stock/m/sell',
    data
  } )
}

export function stockPara(data){
  return request({
    method:'post',
    url:'/roles/v1/stock/m/para',
    data
  })
}