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

/**
 * @description: 获取员工列表
 * @param {*} params {page:当前页,size：每页条数}
 * @return {*}
 */
export function getEmployeesList(params) {
  return request({
    methods: 'get',
    url: '/sys/user',
    params
  })
}

/**
 * @description: 删除员工
 * @param {*} id 员工id
 * @return {*}
 */
export function delEmployee(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}

/**
 * @description: 添加员工
 * @param {*} data
 * @return {*}
 */
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

/**
 * @description: 导入excel
 * @param {*} data
 * @return {*}
 */
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 * @description: 保存员工信息
 * @param {*} data
 * @return {*}
 */
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put', // 全量修改
    data
  })
}
