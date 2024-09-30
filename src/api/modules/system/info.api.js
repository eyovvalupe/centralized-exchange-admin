import request from '/@/api/request'


export function getList( data ) {
  return request({
    method : 'post',
    url : '/roles/v1/syspara/list',
    data
  })
}

export function apiEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/syspara/update',
    data
  } )
}
export function apiDetail( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/syspara/get',
    data
  } )
}

