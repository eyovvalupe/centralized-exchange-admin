import request from '/@/api/request'

export function apiUserList (data) {
  return request({
    method: 'post',
    url: '/roles/v1/user/q/list',
    data
  })
}
export function apiUser (data) {
  return request({
    method: 'post',
    url: '/authc/v1/user/basic',
    data
  })
}

export function apiUserFunds(data) {
  return request({
    method: 'post',
    url: '/authc/v1/user/funds',
    data
  })
}

export function apiUserBalance (data) {
  return request({
    method: 'post',
    url: '/authc/v1/account/balance',
    data
  })
}
export function apiWalletBalance (data) {
  return request({
    method: 'post',
    url: '/authc/v1/wallet/balance',
    data
  })
}

export function apiUserDeposit (data) {
  return request({
    method: 'post',
    url: '/roles/v1/user/deposit',
    data
  })
}
export function apiUserKYC (data) {
  return  request({
    method: 'post',
    url: '/roles/v1/user/m/kyc',
    data
  })
}

export function apiCurrency (data) {
  return  request({
    method: 'post',
    url: '/authc/v1/wallet/currency',
    data
  })
}

export function apiUserWallet (data) {
  return request({
    method: 'post',
    url: '/roles/v1/wallet/m/adjust',
    data
  })
}
export function apiSetlimit (data) {
  return request({
    method: 'post',
    url: '/roles/v1/user/m/limit',
    data
  })
}
export function apiGetPlayerList (data) {
  return request({
    method: 'post',
    url: '/roles/v1/user/withdraw',
    data
  })
}
export function apiUserWithdraw (data) {
  return request({
    method: 'post',
    url: '/roles/v1/user/withdraw',
    data
  })
}


export function apiUserEdit( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/user/m/update',
    data
  } )
}

export function apiUpfather( data ) {
  return request( {
    method : 'post',
    url : '/roles/v1/user/m/upfather',
    data
  } )
}

/**
 * 锁定恢复
 * @param {*} data
 * @returns
 */
export function apiLockUser( data ) {
  return request( {
    method : 'post',
    url : '/authc/v1/user/lockUser',
    data
  } )
}

/**
 * 修改用户代理
 * @param {*} data
 * @returns
 */
export function apiEditUserAgent( data ) {
  return request( {
    method : 'post',
    url : '/authc/v1/user/editUserAgent',
    data
  } )
}

/**
 * 重置链接
 * @param {*} data
 * @returns
 */
export function apiResetUrl( data ) {
  return request( {
    method : 'post',
    url : '/authc/v1/user/resetUrl',
    data
  } )
}


/**
 * 账变记录
 * @param {*} data
 * @returns
 */
export function apiAddGuestUser( data ) {
  return request( {
    method : 'post',
    url : '/authc/v1/user/addGuestUser',
    data
  } )
}

