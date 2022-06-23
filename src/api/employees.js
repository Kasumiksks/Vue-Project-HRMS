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

// /**
//  * @description: 获取员工列表
//  * @param {*} params {page:当前页,size：每页条数}
//  * @return {*}
//  */
// export function getEmployeesList(params) {
//   return request({
//     methods: 'get',
//     url: '/sys/user',
//     params
//   })
// }
