import request from '@/utils/prometheus-request'

export function getNodeList() {
  return request({
    url: '/search',
    method: 'get'
  })
}

export function getStatus() {
  return request({
    url: 'datasources/proxy/1/api/v1/targets',
    method: 'get'
  })
}

export function getTemplatingLabel(uid) {
  return request({
    url: '/dashboards/uid/' + uid,
    method: 'get'
  })
}

export function getJobList(query = '') {
  return request({
    url: '/datasources/proxy/1/api/v1/query?query=' + query,
    method: 'get'
  })
}

export function getDatasources() {
  return request({
    url: '/datasources',
    method: 'get',
    headers: { 'X-WEBAUTH-USER': 'admin' },
    params: [
      {
        login: 'admin',
        isAdmin: true
      }
    ]
  })
}
