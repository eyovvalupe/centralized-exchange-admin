import request from '/@/api/request'


export function getList( data ) {
  return request({
    method : 'post',
    url : 'roles/v1/agent/q/list',
    data
  })
}
export function getAgentMenu( data ) {
  return request({
    method : 'post',
    url : '/roles/v1/data/agent/menu',
    data
  })
}

export function getAgentList( data ) {
  return request({
    method : 'post',
    url : '/roles/v1/data/agent/list',
    data
  })
}


export function apiAddAgent( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/agent/m/add',
    data
  } )
}

/**
 * 修改代理
 * @param {*} data
 * @returns
 */
export function apiEditAgent( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/agent/m/update',
    data
  } )
}
export function apiResetPwd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/agent/m/resetps',
    data
  } )
}
export function apiUpfatherAgent( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/agent/m/upfather',
    data
  } )
}

