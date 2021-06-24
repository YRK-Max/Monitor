<template>
  <el-row class="main-row">
    <el-col :span="24">
      <el-card
        header="Grafana 配置"
      >
        <el-form
          ref="GrafanaForm"
          :model="GrafanaForm"
          :rules="GrafanaFormRules"
          label-width="140px"
          label-position="left"
        >
          <el-form-item label="Grafana Server" prop="hostname">
            <div style="width: 280px; display: flex; justify-content: space-around">
              <el-input v-model="GrafanaForm.hostname" style="margin-right: 10px" />
              <el-button type="primary">修改</el-button>
            </div>
          </el-form-item>
        </el-form>
        <el-divider />
        <div class="mb-10">
          <el-button type="primary" @click="handlerAddGrafanaCOnf">新增</el-button>
        </div>
        <el-table
          :data="instanceList"
          :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
          :height="300"
          highlight-current-row
          @row-click="handlerInstanceListClick"
        >
          <el-table-column type="index" label="NO." />
          <el-table-column prop="group" label="JOB 组" />
          <el-table-column prop="name" label="JOB 名称" />
          <el-table-column prop="job" label="JOB" />
          <el-table-column prop="targets" label="目标" />
          <el-table-column prop="uid" label="UID" />
          <el-table-column prop="url" label="URL" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text">编辑</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" @click="handlerInstanceDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="24">
      <el-card
        header="Prometheus 配置"
      >
        <el-row>
          <el-col :span="24">
            <el-form label-width="150px" label-position="left" :model="PrometheusForm" :rules="PrometheusFormRules">
              <el-form-item label="scrape_interval" prop="scrape_interval">
                <el-input-number v-model="PrometheusForm.scrape_interval" style="width: 220px" /><label style="margin-left: 12px">S</label>
              </el-form-item>
              <el-form-item label="evaluation_interval" prop="evaluation_interval">
                <el-input-number v-model="PrometheusForm.evaluation_interval" style="width: 220px" /><label style="margin-left: 12px">S</label>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="24">
            <el-button style="margin-bottom: 10px" type="primary" icon="el-icon-plus">添加节点</el-button>
            <el-table
              :data="targetList"
              :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column
                prop="labels.job"
                label="Job Name"
              />
              <el-table-column
                prop="labels.instance"
                label="Instance"
              />
              <el-table-column
                prop="scrapeUrl"
                label="Scrape Url"
              />
            </el-table>
          </el-col>
          <el-col :span="24">
            <div class="operation-panel">
              <el-button type="success" style="float: right" icon="el-icon-refresh">重启生效</el-button>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <grafana-conf-form-modal ref="xGrafanaFormModal" />
  </el-row>
</template>

<script>
import { getAllNodeInfo } from '@/api/prometheus'
import { getGrafanaDashboardConfs, deleteGrafanaDashboardConf, getPrometheusConf } from '@/api/monitor'
import GrafanaConfFormModal from '@/modules/monitor/modal/GrafanaConfFormModal'

export default {
  name: 'MonitorConfig',
  components: { GrafanaConfFormModal },
  data() {
    return {
      GrafanaForm: {
        hostname: '127.0.0.1:3000'
      },
      GrafanaFormRules: {
        hostname: [
          { required: true, message: 'Grafana Server 不能为空' }
        ]
      },
      PrometheusForm: {
        scrape_interval: 60,
        evaluation_interval: 60
      },
      PrometheusFormRules: {
        scrape_interval: [
          { required: true, message: '必填项未填' },
          { min: 60, message: '采集时长不能小于 1 分钟' }
        ],
        evaluation_interval: [
          { required: true, message: '必填项未填' },
          { min: 60, message: 'evaluation 时长不能小于 1 分钟' }
        ]
      },
      targetList: [],
      instanceList: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.refreshTargets()
      getGrafanaDashboardConfs().then(res => {
        if (res) {
          this.instanceList = res
        }
      })

      getPrometheusConf().then(res => {
        console.log(res)
      })
    },
    async refreshTargets() {
      const targets = await getAllNodeInfo()
      if (targets && targets['data']) {
        this.targetList = targets['data']['activeTargets']
      }
    },
    handlerInstanceListClick(row) {
      console.log(row)
    },
    handlerInstanceDelete(row) {
      const params = { jobName: row['job'], uid: row['uid'] }
      deleteGrafanaDashboardConf(params).then(res => {
        console.log(res)
        this.$message.success('删除成功')
      })
    },
    handlerAddGrafanaCOnf() {
      this.$refs.xGrafanaFormModal.controlVisible(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-row {
  margin: 5px;
  ::v-deep .el-col {
    margin-bottom: 12px;
  }

  ::v-deep .el-divider--horizontal {
    margin: 10px 0;
  }
}
</style>
