import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/query/list',
    data
  } )
}
export function getDetail(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/query/get',
    data
  } )
}
export function getIpoPara(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/query/para',
    data
  } )
}

export function apiAdd( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/manage/add',
    data
  } )
}

export function apiEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/manage/update',
    data
  } )
}
export function apiDel( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/ipo/manage/del',
    data
  } )
}

