import cis_request from '@/utils/request-cis'
import qs from 'qs'

export function getAllServerInstance() {
  return cis_request({
    url: '/app/server-manager/server-node',
    method: 'get'
  })
}

// service process manager
export function startProcess(confId, data) {
  return cis_request({
    url: `/app/server-manager/start-server-node-process/${confId}`,
    method: 'post',
    params: data,
    data: [confId]
  })
}

export function stopProcess(data) {
  return cis_request({
    url: '/app/server-manager/stop-server-node-process',
    method: 'post',
    data: data
  })
}

export function getProcessByHost(data) {
  return cis_request({
    url: '/app/server-manager/server-node-process',
    method: 'get',
    params: data
  })
}

// Program Conf
export function getProgramConf(data) {
  return cis_request({
    url: '/app/server-manager/program-conf',
    method: 'get',
    params: data
  })
}

export function programConfigCU(data) {
  return cis_request({
    url: '/app/server-manager/create-and-update-program-conf',
    method: 'post',
    data: data
  })
}

export function deleteProgramConfig(data) {
  return cis_request({
    url: '/app/server-manager/program-conf',
    method: 'delete',
    params: data,
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// Log
export function getLogFileTrees(data) {
  return cis_request({
    url: '/app/server-manager/service-logs-file-item',
    method: 'get',
    params: data
  })
}

export function takeFilePck(programPackageId, info, pathList) {
  return cis_request({
    url: `/app/server-manager/pack-service-logs/${programPackageId}`,
    method: 'post',
    params: info,
    data: pathList
  })
}
