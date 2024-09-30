import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/merchant/list',
    data
  } )
}

 
export function apiAdd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/merchant/add',
    data
  } )
}

export function apiEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/merchant/update',
    data
  } )
}


export function apiDel( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/config/del',
    data
  } )
} 


export function apiDetial( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/c2c/merchant/get',
    data
  } )
}

 

