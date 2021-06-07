import request from '@/utils/prometheus-request'

export function getNodeList() {
  return request({
    url: '/v1/targets',
    method: 'get'
  })
}
