import request from '/@/api/request'


export function getList( data ) {
  return request({
    method : 'post',
    url : '/roles/v1/sysuser/list',
    data
  })
}

export function apiAdd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/sysuser/add',
    data
  } )
}


export function apiEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/sysuser/update',
    data
  } )
}

export function apiResetPwd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/sysuser/resetps',
    data
  } )
}
export function apiAllrole( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/sysrole/list',
    data
  } )
}
export function apiUserByid( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/sysuser/get',
    data
  } )
}

