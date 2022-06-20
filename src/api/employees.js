import request from '@/utils/request'

/**
 * 获取公司的员工列表
 * @param {*} data
 * @returns
 */
export function getEmployeeSList() {
  return request({
    method: 'get',
    url: '/sys/user/simple'
  })
}
