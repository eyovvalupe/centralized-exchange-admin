import request from '/@/api/request'

/**
 * 用户列表
 * @param {*} data
 * @returns
 */
export function apiUserList (data) {
  return request({
    method: 'post',
    url: '/roles/v1/support/user/list',
    data
  })
}

/**
 * 创建会话
 * @param {*} data
 * @returns
 */
export function apiCreateChatInfo (partyid) {
  return request({
    method: 'post',
    url: '/roles/v1/support/user/create',
    data: {
      partyid
    }
  })
}

/**
 * 消息翻页
 * @param {*} data
 * @returns
 */
export function apiHistoryMsg (data) {
  return request({
    method: 'post',
    url: '/roles/v1/support/msg/list',
    data
  })
}

export function apiMsgRead (data) {
  return request({
    method: 'post',
    url: '/roles/v1/support/msg/read',
    data
  })
}
export function getAllUsers (data) {
  return request({
    method: 'post',
    url: '/roles/v1/user/list',
    data
  })
}


/**
 * 删除消息
 * @param {*} data
 * @returns
 */
export function apiDelMsg (data) {
  return request({
    method: 'post',
    url: '/roles/v1/support/manage/delmsg',
    data
  })
}

/**
 * 获取黑明单
 * @param {*} data
 * @returns
 */
export function apiBlacklist (data) {
  return request({
    method: 'post',
    url: '/roles/v1/support/manage/blacklist/add',
    data
  })
}

/**
 * 添加黑明单
 * @param {*} data
 * @returns
 */
export function apiAddBlacklist (data) {
  return request({
    method: 'post',
    url: '/authc/v1/support/addBlackList',
    data
  })
}

/**
 * 移除黑明单
 * @param {*} data
 * @returns
 */
export function apiRemoveBlacklist (data) {
  return request({
    method: 'post',
    url: '/roles/v1/support/manage/blacklist/del',
    data
  })
}
export function apiSetRemark (data) {
  return request({
    method: 'post',
    url: '/roles/v1/support/manage/remarks',
    data
  })
}

/**
 * 用户搜索
 * @param {*} data
 * @returns
 */
export function apiUserSearch (data) {
  return request({
    method: 'post',
    url: '/roles/v1/support/user/search',
    data
  })
}
