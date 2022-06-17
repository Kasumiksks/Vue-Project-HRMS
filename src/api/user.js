import request from '@/utils/request'

/**
 * 登录功能
 * @param {*} data {mobile,password}
 * @returns
 */
export function login(data) {
  return request({
    method: 'post',
    url: '/sys/login',
    data
  })
}

/**
 * 获取用户的基本资料
 * @param {*} token
 */
export function getInfo() {
  return request({
    method: 'post',
    url: '/sys/profile'
  })
}
export function logout() {
}
