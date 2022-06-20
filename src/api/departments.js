import request from '@/utils/request'

/**
 * 获取公司的部门
 * @param {*} data
 * @returns
 */
export function getDepartments() {
  return request({
    method: 'get',
    url: '/company/department'
  })
}
