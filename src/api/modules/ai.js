import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/config/list',
    data
  } )
}

export function getCtrList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/control/list',
    data
  } )
}

export function futureSell( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/sell',
    data
  } )
}
export function getFutureList( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/config/items',
    data
  } )
}

export function apiAdd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/config/add',
    data
  } )
}

export function apiEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/config/update',
    data
  } )
}
export function apiCtrAdd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/control/add',
    data
  } )
}

export function apiCtrEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/control/update',
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
export function apiCtrDel( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/control/del',
    data
  } )
}

export function apiCtrDetial( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/control/get',
    data
  } )
}

export function apiDetial( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/config/get',
    data
  } )
}

export function apiQueryList( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/q/list',
    data
  } )
}
export function apiQueryOne( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/aiquant/q/get',
    data
  } )
}

