import request from '/@/api/request'


export function getList( data ) {
  return request({
    method : 'post',
    url : '/roles/v1/kyc/list',
    data
  })
}
export function getDetail( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/kyc/get',
    data
  } )
}


export function apiEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/kyc/check',
    data
  } )
}

