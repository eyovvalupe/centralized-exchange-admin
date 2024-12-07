import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/config/list',
    data
  } )
}

export function futureSell( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/m/sell',
    data
  } )
}
export function getFutureList( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/config/items',
    data
  } )
}

export function apiAdd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/config/add',
    data
  } )
}

export function apiEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/config/update',
    data
  } )
}

export function apiDel( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/config/del',
    data
  } )
}
export function apiGet( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/config/get',
    data
  } )
}
export function apiConfig( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/config/confget',
    data
  } )
}
export function apiUpdateConfig( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/config/confupdate',
    data
  } )
}
export function apiAdjustg( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/control/adjust',
    data
  } )
}
export function apiVolume( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/control/volume',
    data
  } )
}
export function apiDetial( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/control/get',
    data
  } )
}
export function apiClear( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/control/clear',
    data
  } )
}

export function apiQueryList( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/q/list',
    data
  } )
}
export function apiQueryOne( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/futures/q/get',
    data
  } )
}

