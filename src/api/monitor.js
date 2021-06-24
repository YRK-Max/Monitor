import cis_request from '@/utils/request-cis'

export function prometheusConf() {
  return cis_request({
    url: '/app/config/prometheus-conf',
    method: 'get'
  })
}
