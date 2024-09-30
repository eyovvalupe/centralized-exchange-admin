import request from '/@/api/request'

export function getList(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/fxrate/list',
    data
  } )
}
export function apiEdit(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/fxrate/update',
    data
  } )
}
export function apiAutoUp(data) {
  return request( {
    method : 'post',
    url : '/roles/v1/fxrate/autoup',
    data
  } )
}