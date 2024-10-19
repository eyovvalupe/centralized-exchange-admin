import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/q/list',
    data
  } )
}
export function getDetail(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/q/get',
    data
  } )
}
export function getIpoPara(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/q/para',
    data
  } )
}

export function apiAdd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/m/add',
    data
  } )
}

export function apiEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/m/update',
    data
  } )
}
export function apiDel( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/m/del',
    data
  } )
}

