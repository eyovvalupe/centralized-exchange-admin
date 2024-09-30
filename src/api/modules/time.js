import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/config/time/list',
    data
  } )
}

export function apiAdd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/config/time/add',
    data
  } )
}

export function apiEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/config/time/update',
    data
  } )
}

export function apiDel( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/config/time/del',
    data
  } )
}

export function apiDetial( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/config/time/get',
    data
  } )
}
