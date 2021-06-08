import request_grafana from '@/utils/request-grafana'

// 获取所有JOB数据
export function getNodeList() {
  return request_grafana({
    url: '/search',
    method: 'get'
  })
}

export function getTemplatingLabel(uid) {
  return request_grafana({
    url: '/dashboards/uid/' + uid,
    method: 'get'
  })
}

// auth proxy 请求, 请求所有的 datasource
export function getDatasources() {
  return request_grafana({
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
