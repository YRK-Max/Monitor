import request from '@/utils/request'
import querystring from 'querystring'
import cis_request from '@/utils/request-cis'

/** -------------------------------登录操作------------------------------- **/
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

/** -------------------------------用户相关------------------------------- **/
export function getUsers(data) {
  return cis_request({
    url: '/identity/users',
    method: 'get',
    params: data
  })
}

export function deleteUsersById(id) {
  return cis_request({
    url: `/identity/users/${id}`,
    method: 'delete'
  })
}

export function createUser(data) {
  return cis_request({
    url: '/identity/users',
    method: 'post',
    data
  })
}

export function modifyUserById(id, data) {
  return cis_request({
    url: `/identity/users/${id}`,
    method: 'put',
    data
  })
}

/** -------------------------------角色相关------------------------------- **/
export function getRoles() {
  return cis_request({
    url: '/identity/roles',
    method: 'get'
  })
}

export function createRole(data) {
  return cis_request({
    url: '/identity/roles',
    method: 'post',
    data
  })
}

export function getRolesByUserId(id) {
  return cis_request({
    url: `/identity/users/${id}/roles`,
    method: 'get'
  })
}

export function deleteRolesById(id) {
  return cis_request({
    url: `/identity/roles/${id}`,
    method: 'delete'
  })
}
