import request from '@/utils/request'

/**
 * 登录功能
 * @param {*} data {mobile,password}
 * @returns
 */
export function login(data) {
  return request({
    method: 'post',
    url: '/api/sys/login',
    data
  })
}
export function getInfo(token) {
}
export function logout() {
}
