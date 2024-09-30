import request from '/@/api/request'

/**
 * 用户登录
 * @param {*} data
 * @returns
 */
export function apiLogin( data ) {
  return request( {
    method : 'post',
    url : '/anon/v1/auth/login',
    data
  } )
}
// 查询绑定谷歌
export function getGoogleCode() {
  return request( {
    method : 'post',
    url : '/authc/v1/auth/google/get',
  } )
}

export function bindGoogleCode(data) {
  return request( {
    method : 'post',
    url : '/authc/v1/auth/google/bind',
    data
  } )
}
export function updatePwd(data) {
  return request( {
    method : 'post',
    url : '/authc/v1/auth/password',
    data
  } )
}
export function updateSw(data) {
  return request( {
    method : 'post',
    url : '/authc/v1/auth/safeword',
    data
  } )
}

/**
 * 修改密码
 * @param {*} data
 * @returns
 */
export function resetPwd( data ) {
  return request( {
    method : 'post',
    url : '/authc/v1/user/resetPassword',
    data
  } )
}

/**
 * 权限
 * @param {*} data
 * @returns
 */
export function getAuth( data ) {
  return request( {
    method : 'post',
    url : '/authc/v1/security/matcher',
    data
  } )
}

/**
 * 退出登录
 * @param {*} data
 * @returns
 */
export function apilogout( data ) {
  return request( {
    method : 'post',
    url : '/authc/v1/auth/logout',
    data
  } )
}
