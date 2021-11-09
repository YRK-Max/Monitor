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
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { getAllNodeInfo, getOSNodeList } from '@/api/prometheus'
import { getGrafanaDashboardConfs } from '@/api/monitor'

export default {
  name: 'ServiceList',
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
      const url_ref_list = await getGrafanaDashboardConfs()
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
        const list_temp = res_list_service['data']['result'] || []
        list_temp.forEach(d => {
          const temp = d['metric']
          for (const ni of nodeInfoList) {
            for (const ref of url_ref_list) {
              if (ref['job'].toLocaleUpperCase() === temp['job'].toLocaleUpperCase()) {
                temp['url'] = ref['url'] + '&kiosk'
              }
            }

            if (ni['labels']['job'].toLocaleUpperCase() === temp['job'].toLocaleUpperCase()) {
              temp['active_state'] = ni['active_state']
              temp['health'] = ni['health']
              temp['lastError'] = ni['lastError']
              break
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
