import request from '@/utils/request'
import querystring from 'querystring'

export function login(data) {
  return request({
    url: '/token',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: querystring.stringify(data)
  })
}

export function getInfo() {
  return request({
    url: '/userinfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/userinfo',
    method: 'post'
  })
}
