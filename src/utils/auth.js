import Cookies from 'js-cookie'

// 设定一个独一无二的key
const TokenKey = 'vue_Project_HRMS_token'

// 获取cookie中的token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 设置cookie中的token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 删除cookie中的token
export function removeToken() {
  return Cookies.remove(TokenKey)
}
