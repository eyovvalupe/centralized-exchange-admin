import request from '/@/api/request'


export function getList( data ) {
  return request({
    method : 'post',
    url : '/roles/v1/sysrole/list',
    data
  })
}

export function apiAdd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/sysrole/add',
    data
  } )
}


export function apiEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/sysrole/update',
    data
  } )
}

export function apiAuthTree( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/sysrole/authtree',
    data
  } )
}
export function apiDel( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/sysrole/del',
    data
  } )
}

