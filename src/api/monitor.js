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

export function getAppConfs() {
  return cis_request({
    url: '/app/config/grafana-prometheus-conf',
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

// 文件上传
export function upload_file(data) {
  return cis_request({
    url: '/app/file-common/upload-file',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryjdVraQ0GnFIBvbmT'
    },
    data
  })
}

export function upload_program(data, host = undefined) {
  return cis_request({
    url: '/app/server-manager/create-and-update-program-package',
    method: 'post',
    data,
    params: host
  })
}

export function getPackgeList() {
  return cis_request({
    url: '/app/server-manager/program-packge',
    method: 'get'
  })
}

export function deletePackage(data) {
  return cis_request({
    url: '/app/server-manager/program-packge',
    method: 'delete',
    params: { programPackageIdItem: data }
  })
}

export function getServerListByProgramInfo(data) {
  return cis_request({
    url: '/app/server-manager/program-package-run-server',
    method: 'get',
    params: data
  })
}

// Grafana and Prometheus Config
export function getGrafanaDashboardConf() {
  return cis_request({
    url: '/app/config/grafana-dashboard-confs',
    method: 'get'
  })
}

