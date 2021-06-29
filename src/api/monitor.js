import cis_request from '@/utils/request-cis'

// Prometheus Config
export function getPrometheusConf() {
  return cis_request({
    url: '/app/config/prometheus-conf',
    method: 'get'
  })
}

// Grafana Config
export function getGrafanaDashboardConfs() {
  return cis_request({
    url: '/app/config/grafana-dashboard-confs',
    method: 'get'
  })
}

export function deleteGrafanaDashboardConf(data) {
  return cis_request({
    url: '/app/config/grafana-dashboard-confs',
    method: 'delete',
    data
  })
}

export function editGrafanaDashboardConf(data) {
  return cis_request({
    url: '/app/config/update-and-create-grafana-dashboard-confs',
    method: 'post',
    data
  })
}

// service process manager
export function getAllServiceInstance() {
  return cis_request({
    url: '/app/server-manager/server-node',
    method: 'get'
  })
}

export function getProcessByHost(data) {
  return cis_request({
    url: '/app/server-manager/server-node-process',
    method: 'post',
    data
  })
}
