import request from '/@/api/request'

export function withdrawConfigList( data ) {
    return request({
      method : 'post',
      url : '/roles/v1/withdraw/config/list',
      data
    })
}
  
export function withdrawConfigGet( data ) {
  return request({
    method : 'post',
    url : '/roles/v1/withdraw/config/get',
    data
  })
}


export function withdrawConfigAdd( data ) {
    return request({
      method : 'post',
      url : '/roles/v1/withdraw/config/add',
      data
    })
}

export function withdrawConfigUpdate( data ) {
    return request({
      method : 'post',
      url : '/roles/v1/withdraw/config/update',
      data
    })
}

export function withdrawConfigDel( data ) {
    return request({
      method : 'post',
      url : '/roles/v1/withdraw/config/del',
      data
    })
}

  