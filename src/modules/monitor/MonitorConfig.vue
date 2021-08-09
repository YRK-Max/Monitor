<template>
  <el-tabs class="main-tab" type="border-card" style="margin: 5px">
    <el-tab-pane label="Grafana 配置">
      <el-row class="main-row">
        <el-col :span="24">
          <div class="mb-10">
            <el-button type="primary" @click="handlerAddGrafanaCOnf">新增</el-button>
          </div>
          <el-table
            v-loading="tableLoading"
            :data="instanceList"
            :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
            :height="height - 225"
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
                <el-button type="text" @click="handlerEdit(scope.row)">编辑</el-button>
                <el-divider direction="vertical" />
                <el-button type="text" @click="handlerInstanceDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <grafana-conf-form-modal ref="xGrafanaFormModal" />
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="配置文件编辑">
      <el-row>
        <el-col :span="24" style="padding: 8px; background: #ebf5ff; border-radius: 5px; border: 1px solid #6a8fff; height: 60px; margin-bottom: 5px">
          <el-form :inline="true" label-width="110px" label-position="left">
            <el-form-item label="App Conf">
              <el-select v-model="confForm.appConfName" placeholder="请选择">
                <el-option label="grafana" value="grafana" />
                <el-option label="prometheus" value="prometheus" />
              </el-select>
            </el-form-item>
            <el-form-item label="Server Type">
              <el-select v-model="confForm.serverType" placeholder="请选择">
                <el-option label="Windows" value="Windows" />
                <el-option label="Linux" value="Linux" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
              <el-button v-show="isChange" type="primary" size="small">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24">
          <el-input
            v-model="confContent"
            type="textarea"
            rows="35"
            placeholder="请输入内容"
            @input="handleContentChange"
          />
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getGrafanaDashboardConfs, deleteGrafanaDashboardConf, getAppConfs } from '@/api/monitor'
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
      instanceList: [],
      tableLoading: false,
      confForm: {
        appConfName: 'grafana',
        serverType: 'Windows'
      },
      confContent: '',
      appConfs: [],
      isChange: false
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.refreshTargets()
      this.getAppConfigs()
      this.tableLoading = true
      getGrafanaDashboardConfs().then(res => {
        if (res) {
          this.instanceList = res
          this.tableLoading = false
        }
      })
    },
    getAppConfigs() {
      getAppConfs().then(res => {
        if (res && res.length > 0) {
          this.appConfs = res
          const list = res.filter(r => {
            return r['appConfName'] === this.confForm.appConfName && r['serverType'] === this.confForm.serverType
          })
          if (list.length > 0) {
            this.confContent = list[0]['appConfData']
          }
        } else {
          this.$message.error('无返回结果')
        }
      })
    },
    async refreshTargets() {
      const targets = await getGrafanaDashboardConfs()
      if (targets && targets['res']) {
        this.targetList = targets['res']
      }
    },
    handlerInstanceListClick(row) {
      console.log(row)
    },
    handlerInstanceDelete(row) {
      const params = { jobName: row['job'], uid: row['uid'] }
      deleteGrafanaDashboardConf(params).then(res => {
        if (res && res['status']) {
          this.$message.success('删除成功')
        }
      })
    },
    handlerAddGrafanaCOnf() {
      this.$refs.xGrafanaFormModal.controlVisible(true)
    },
    handlerEdit(row) {
      this.$refs.xGrafanaFormModal.controlVisible(true, 'edit', row)
    },
    handleSearch() {
      this.confContent = ''
      const list = this.appConfs.filter(r => {
        return r['appConfName'] === this.confForm.appConfName && r['serverType'] === this.confForm.serverType
      })
      if (list.length > 0) {
        this.confContent = list[0]['appConfData']
      }
    },
    handleContentChange() {
      this.isChange = true
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

.main-tab {
  ::v-deep .el-tabs--border-card > .el-tabs__content {
    padding: 5px;
  }
}
</style>
