import request_prometheus from '@/utils/request-prometheus'

// 获取所有job的状态信息
export function getAllNodeInfo() {
  return request_prometheus({
    url: '/v1/targets',
    method: 'get'
  })
}

// 根据参数获取所有系统node的状态信息
export function getOSNodeList(os_type) {
  return request_prometheus({
    url: '/v1/query?query=' + os_type,
    method: 'get'
  })
}
