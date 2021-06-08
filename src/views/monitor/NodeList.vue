<template>
  <el-row class="main-row">
    <el-col :span="24">
      <div class="params-panel">
        <el-form inline label-position="left">
          <el-form-item label="IP" label-width="50px">
            <el-input style="width: 250px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    <el-col :span="24">
      <div style="margin: 10px">
        <label>Grafana Server : </label><el-tag>{{ Grafana.server }}</el-tag>
      </div>
    </el-col>
    <el-col :span="24">
      <el-card
        style="margin: 5px; width: calc(100% - 10px)"
        header
      >
        <div slot="header" class="clearfix">
          <span>Windows 服务器</span>
        </div>
        <el-table
          :data="windowsNodeList"
          :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
          tooltip-effect="dark"
          @row-click="handleRowClick"
        >
          <el-table-column
            prop="job"
            label="JOB"
          />
          <el-table-column
            prop="health"
            label="Status"
          >
            <template slot-scope="scope">
              <div style="display: flex; align-content: center">
                <i :class="['yicon-common', 'yiconB', scope.row['health']]" />
                <el-tag :type="scope.row['health'] === 'up'?'success':'danger'" size="small">{{
                  scope.row['health']
                }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="instance"
            label="Instance"
            sortable
          />
          <el-table-column
            prop="lastError"
            label="Last Error"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="product"
            label="OS"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="version"
            label="版本"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="active_state"
            label="活动状态"
            :show-overflow-tooltip="true"
          />
        </el-table>
      </el-card>
      <el-card
        style="margin: 5px; width: calc(100% - 10px)"
        header
      >
        <div slot="header" class="clearfix">
          <span>Linux 服务器</span>
        </div>
        <el-table
          :data="linuxNodeList"
          :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
          tooltip-effect="dark"
          @row-click="handleRowClick"
        >
          <el-table-column
            prop="job"
            label="JOB"
          />
          <el-table-column
            prop="health"
            label="Status"
          >
            <template slot-scope="scope">
              <div style="display: flex; align-content: center">
                <i :class="['yicon-common', 'yiconB', scope.row['health']]" />
                <el-tag :type="scope.row['health'] === 'up'?'success':'danger'" size="small">{{
                  scope.row['health']
                }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="nodename"
            label="Node Name"
            sortable
          />
          <el-table-column
            prop="instance"
            label="Instance"
            sortable
          />
          <el-table-column
            prop="lastError"
            label="Last Error"
          />
          <el-table-column
            prop="sysname"
            label="OS"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="version"
            label="版本"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="active_state"
            label="活动状态"
            :show-overflow-tooltip="true"
          />
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { getAllNodeInfo, getOSNodeList } from '@/api/prometheus'

export default {
  name: 'NodeList',
  data() {
    return {
      Grafana: {
        server: '10.3.5.124:3000'
      },
      windowsNodeList: [],
      linuxNodeList: []
    }
  },
  created() {
    this.initNodeData()
  },
  methods: {
    handleRowClick(row) {
      this.$router.push({
        name: 'Grafana',
        params: { url: row['url'] }
      })
    },
    async initNodeData() {
      const linux_list = []
      const windows_list = []
      let nodeInfoList = []
      const url_ref_list = [
        {
          'Group': 'Dashboard',
          'Name': 'Windows服务器监控',
          'JOB': 'Cissystem_Linux',
          'Targets': '10.3.5.124:9100',
          'Uid': '9CWBz0bikw',
          'Url': 'http://{@IPAddress}/d/9CWBz0bikw/linux-fu-wu-qi-jian-kong?orgId=1'
        },
        {
          'Group': 'Dashboard',
          'Name': 'Windows服务器监控',
          'JOB': 'CisServer_Windows',
          'Targets': '10.3.5.104:9182',
          'Uid': 'Kdh0OoSGz',
          'Url': 'http://{@IPAddress}/d/Kdh0OoSGz/windowsfu-wu-qi-jian-kong?orgId=1'
        },
        {
          'Group': 'Dashboard',
          'Name': '.NET Core -App',
          'JOB': 'CisServerApi',
          'Targets': '10.3.5.104:44344',
          'Uid': 'h1FE3PpWk',
          'Url': 'http://{@IPAddress}/d/h1FE3PpWk/net-core-app?orgId=1'
        },
        {
          'Group': 'Dashboard',
          'Name': 'Linux 服务器监控',
          'JOB': 'EQLinker_windows',
          'Targets': '10.3.5.109:9182',
          'Uid': 'Kdh0OoSGz',
          'Url': 'http://{@IPAddress}/d/Kdh0OoSGz/windowsfu-wu-qi-jian-kong?orgId=1&var-job=EQLinker_windows&var-hostname=All&var-instance=10.3.5.109:9182&var-show_hostname=DESKTOP-FIQS2U7'
        },
        {
          'Group': 'Dashboard',
          'Name': 'Linux 服务器监控',
          'JOB': 'WebUI_Linux',
          'Targets': '10.3.5.116:9100',
          'Uid': '9CWBz0bikw',
          'Url': 'http://{@IPAddress}/d/9CWBz0bikw/linux-fu-wu-qi-jian-kong?orgId=1&var-job=WebUI_Linux&var-hostname=All&var-node=10.3.5.116:9100&var-device=All&var-maxmount=%2F&var-show_hostname=localhost.localdomain'
        },
        {
          'Group': 'Dashboard',
          'Name': 'CIS30 服务器集合',
          'JOB': '--',
          'Targets': '10.3.5.124:3000',
          'Uid': '-C03y-3Gz',
          'Url': 'http://{@IPAddress}/d/-C03y-3Gz/cis30-fu-wu-qi-ji-he?orgId=1'
        }
      ]
      const res_nodeInfoList = await getAllNodeInfo()
      const res_list_linux = await getOSNodeList('node_uname_info')
      const res_list_windows = await getOSNodeList('windows_os_info')

      if (res_nodeInfoList && res_nodeInfoList['status'].toString() === 'success' && res_nodeInfoList['data']['activeTargets']) {
        const active_list = res_nodeInfoList['data']['activeTargets']
        active_list.forEach(d => { d['active_state'] = 'active' })
        const dropped_list = res_nodeInfoList['data']['droppedTargets']
        dropped_list.forEach(d => { d['active_state'] = 'dropped' })
        nodeInfoList = Object.assign(active_list, ...dropped_list)
      }

      if (res_list_linux['status'].toString() === 'success') {
        res_list_linux['data']['result'].forEach(d => {
          const temp = d['metric']
          for (const ni of nodeInfoList) {
            if (ni['labels']['job'] === temp['job']) {
              temp['active_state'] = ni['active_state']
              temp['health'] = ni['health']
              temp['lastError'] = ni['lastError']
              break
            }
          }

          for (const ref of url_ref_list) {
            if (ref['JOB'] === temp['job']) {
              temp['url'] = ref['Url'].replace('{@IPAddress}', this.Grafana.server) + '&kiosk'
              break
            }
          }
          linux_list.push(temp)
        })
      }
      if (res_list_windows['status'].toString() === 'success') {
        res_list_windows['data']['result'].forEach(d => {
          const temp = d['metric']
          for (const ni of nodeInfoList) {
            if (ni['labels']['job'] === temp['job']) {
              temp['active_state'] = ni['active_state']
              temp['health'] = ni['health']
              temp['lastError'] = ni['lastError']
              break
            }

            for (const ref of url_ref_list) {
              if (ref['JOB'] === temp['job']) {
                temp['url'] = ref['Url'].replace('{@IPAddress}', this.Grafana.server) + '&kiosk'
                break
              }
            }
          }
          windows_list.push(temp)
        })
      }

      this.linuxNodeList = linux_list
      this.windowsNodeList = windows_list
    }
  }
}
</script>

<style lang="scss" scoped>
.params-panel {
  background: #f7faff;
  height: 60px;
  margin: 5px;
  padding: 8px;
  border-radius: 5px;
  display: flex;
  align-content: center;
  border: 1px solid #9cc4ff;
}

.up {
  margin-right: 10px;
  font-size: 20px;
  color: #42b983;
}

.down {
  margin-right: 10px;
  font-size: 20px;
  color: #d02828;
}
</style>
