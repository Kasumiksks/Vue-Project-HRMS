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

/**
 * @description: 新增子部门
 * @param {*}
        data {
            name: '', // 部门名称
            code: '', // 部门编码
            manager: '', // 部门管理者
            introduce: '', // 部门介绍
            pid: '' // 新增的这个子部门的上级部门
        }
 * @return {*}
 */
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
