import request from '/@/api/request'


export function getList( data ) {
  return request({
    method : 'post',
    url : '/roles/v1/walletlog/list',
    data
  })
}

