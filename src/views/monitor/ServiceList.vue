<template>
  <el-row class="main-row">
    <el-col :span="24">
      <el-card class="params-panel">
        <el-form inline label-position="left">
          <el-form-item label="IP" label-width="50px">
            <el-input style="width: 250px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>
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
          <span>服务列表</span>
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
            align="center"
          >
            <template slot-scope="scope">
              <div style="display: flex; align-content: center; justify-content: center">
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
            align="center"
            sortable
          />
          <el-table-column
            prop="lastError"
            label="Last Error"
            align="center"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="active_state"
            label="活动状态"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div style="display: flex; align-content: center; justify-content: center">
                <el-tag :type="scope.row['active_state'] === 'active'?'success':'danger'" size="small">{{
                  scope.row['active_state']
                }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="Operation"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-setting" circle @click="handleManager($event, scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-dialog
      title="操作"
      :visible.sync="dialogVisible"
      width="320px"
      :before-close="handleClose"
    >
      <div class="info-container">
        <div class="info-div">
          <label>JOB</label><span class="info-span">{{ currentService.job }}</span>
        </div>
        <div class="info-div">
          <label>Status</label>
          <div style="display: flex; align-content: center; justify-content: center; width: 200px">
            <i :class="['yicon-common', 'yiconB', currentService['health']]" />
            <el-tag :type="currentService['health'] === 'up'?'success':'danger'" size="small">{{
              currentService['health']
            }}
            </el-tag>
          </div>
        </div>
        <div class="info-div">
          <label>Instance</label><span class="info-span">{{ currentService.instance }}</span>
        </div>
      </div>
      <div class="operation-container">
        <el-popconfirm
          title="确定停止服务吗？"
        >
          <el-button slot="reference" :disabled="currentService['health'] === 'down'" type="danger">停止</el-button>
        </el-popconfirm>
        <el-button :disabled="currentService['health'] === 'up'" type="success">启动</el-button>
        <el-button type="primary">重启</el-button>
      </div>
    </el-dialog>
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
      linuxNodeList: [],
      dialogVisible: false,
      currentService: {
        job: '',
        health: 'up',
        instance: ''
      }
    }
  },
  created() {
    this.initNodeData()
  },
  methods: {
    handleRowClick(row) {
      if (row['url']) {
        this.$router.push({
          name: 'Grafana',
          params: { url: row['url'] }
        })
      } else {
        this.$message.info('该服务未配置看板')
      }
    },
    async initNodeData() {
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
      const res_list_service = await getOSNodeList('up')

      if (res_nodeInfoList && res_nodeInfoList['status'].toString() === 'success' && res_nodeInfoList['data']['activeTargets']) {
        const active_list = res_nodeInfoList['data']['activeTargets']
        active_list.forEach(d => { d['active_state'] = 'active' })
        const dropped_list = res_nodeInfoList['data']['droppedTargets']
        dropped_list.forEach(d => { d['active_state'] = 'dropped' })
        nodeInfoList = Object.assign(active_list, ...dropped_list)
      }

      if (res_list_service['status'].toString() === 'success') {
        res_list_service['data']['result'].forEach(d => {
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

      this.windowsNodeList = windows_list
    },
    handleManager(e, row) {
      e.stopPropagation()
      this.dialogVisible = true
      this.currentService = row
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.params-panel {
  background: #f7faff;
  height: 65px;
  margin: 5px;
  border-radius: 5px;
  display: flex;
  align-content: center;
  border: 1px solid #9cc4ff;

  ::v-deep .el-card__body{
    padding: 12px;
  }
}

.up {
  margin-right: 10px;
  font-size: 20px;
  color: #42b983;
}

.down {
  margin-right: 10px;
  color: #d02828;
}

.operation-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
}

.info-div {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;

  .info-span {
    width: 200px;
    text-align: center;
  }
}
</style>
