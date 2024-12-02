import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/config/list',
    data
  } )
}

export function blocktradeSell( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/m/sell',
    data
  } )
}
export function getBlocktradeList( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/config/items',
    data
  } )
}

export function apiAdd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/config/add',
    data
  } )
}

export function apiEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/config/update',
    data
  } )
}

export function apiDel( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/config/del',
    data
  } )
}
export function apiConfig( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/config/confget',
    data
  } )
}
export function apiUpdateConfig( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/config/confupdate',
    data
  } )
}
export function apiAdjustg( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/control/adjust',
    data
  } )
}
export function apiVolume( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/control/volume',
    data
  } )
}
export function apiDetial( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/control/get',
    data
  } )
}
export function apiClear( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/control/clear',
    data
  } )
}

export function apiQueryList( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/q/list',
    data
  } )
}
export function apiQueryOne( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/q/get',
    data
  } )
}

export function blocktradeLock( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/blocktrade/m/lock',
    data
  } )
}
