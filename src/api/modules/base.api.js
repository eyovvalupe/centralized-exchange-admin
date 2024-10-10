import request from '/@/api/request'
export function getSessionToken() {
  return request({
    method: 'post',
    url: '/anon/v1/comm/token'
  })
}
export function getAllAuth(data) {
  return request({
    method: 'post',
    url: '/authc/v1/security/matcher',
    data
  })
}

export function getglobalTotal(data) {
  return request({
    method: 'post',
    url: '/roles/v1/data/global/total',
    data
  })
}

export function getglobalDate(data) {
  return request({
    method: 'post',
    url: '/roles/v1/data/global/date',
    data
  })
}

// 搜索股票
export const searchMarket = (data = {}) => {
  return request({
    method: 'post',
    url: '/anon/v1/item/search',
    data
  })
};

// 获取股票基本信息
export const symbolBasic = (data = {}) => {
  return request({
    method: 'post',
    url: '/anon/v1/item/basic',
    data
  })
};

export function getagentList(data) {
  return request({
    method: 'post',
    url: '/roles/v1/data/agent/list',
    data
  })
}
export function getRealtime(symbol) {
  return request({
    method: 'get',
    url: '/anon/v1/ticker/realtime?symbol='+symbol,
  })
}
export function getGlobalCurrencyList(data) {
  return request({
    method: 'post',
    url: '/roles/v1/data/global/total/currency',
    data
  })
}
export function getGlobalWallet(data) {
  return request({
    method: 'post',
    url: '/authc/v1/wallet/main',
    data
  })
}
export function getGlobalWalletList(data) {
  return request({
    method: 'post',
    url: '/authc/v1/wallet/currency',
    data
  })
}

// 代理商我的业绩汇总数据
export function getglobalTotalMy(data) {
  return request({
    method: 'post',
    url: '/roles/v1/data/my/total',
    data
  })
}

// 代理商我的业绩 日期数据
export function getglobalMyDate(data) {
  return request({
    method: 'post',
    url: '/roles/v1/data/my/list',
    data
  })
}
// 代理商我的业绩 充提货币详情
export function getGlobalCurrencyMy(data) {
  return request({
    method: 'post',
    url: '/roles/v1/data/my/currency',
    data
  })
}

// 用户数据汇总数据
export function getglobalTotalUser(data) {
  return request({
    method: 'post',
    url: '/roles/v1/data/user/list',
    data
  })
}

// 用户提现货币详情
export function getGlobalCurrencyUser(data) {
  return request({
    method: 'post',
    url: '/roles/v1/data/user/currency',
    data
  })
}

