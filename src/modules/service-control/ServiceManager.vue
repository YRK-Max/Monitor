<template>
  <el-row v-loading="loading" class="main-row">
    <el-col :span="24">
      <el-card class="params-panel">
        <el-form :model="form" inline label-position="left">
          <el-form-item label="服务类型" label-width="90px">
            <query-select v-model="form.type" :options="serviceTypeList" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlerSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card :body-style="{ padding: '6px' }">
        <div slot="header" class="clearfix">
          <span>服务器实例列表</span>
        </div>
        <div class="content enable-y-scroll no-scroll-bar" :style="{ height: (height + 32) + 'px' }">
          <service-card
            v-for="instance in serviceInstanceList"
            :key="instance['serviceHost']"
            type="instance"
            style="margin-bottom: 3px"
            :hostname="instance['serviceHost'].split(':')[0]"
            :description="instance['sysVersion']"
            :title="instance['serviceType']"
            :os="instance['sysName']"
            :class="[currentServerHost===instance['serviceHost'].split(':')[0]?'selected-card':'']"
            @click="handleInstanceClick"
          />
        </div>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card
        style="margin-left: 5px; width: calc(100% - 10px)"
        :body-style="{ padding: '5px' }"
        header
      >
        <div slot="header" class="clearfix">
          <span>{{ '进程列表 [Host : ' + currentServerHost + ']' }}</span>
          <router-link
            style="float: right; color: #0088ff;"
            :to="{path: '/ProgramConf', query: { type: currentServerType, host: currentServerHost }}"
          >
            转到配置<i class="el-icon-right" />
          </router-link>
        </div>
        <el-table
          :data="ProcessList"
          :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
          tooltip-effect="dark"
          :height="height+32"
          stripe
        >
          <el-table-column
            type="index"
            label="#"
            width="50"
          />
          <el-table-column
            prop="processId"
            label="进程ID"
            width="80px"
            align="center"
          />
          <el-table-column
            prop="processName"
            label="进程名称"
            align="center"
            width="200px"
          />
          <el-table-column
            prop="processRunStatus"
            label="运行状态"
            align="center"
            width="200px"
          >
            <template slot-scope="scope">
              <div style="display: flex; align-content: center; justify-content: center">
                <i :class="['yicon-common', 'yiconB', scope.row['processRunStatus']]" />
                <el-tag :type="scope.row['processRunStatus'] === 'RUN'?'success':'danger'" size="small">{{
                  scope.row['processRunStatus']
                }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="processArgs"
            label="进程参数"
            align="center"
            :show-overflow-tooltip="true"
            width="200px"
          />
          <el-table-column
            prop="processPath"
            label="进程路径"
            align="center"
            :show-overflow-tooltip="true"
            width="200px"
          />
          <el-table-column
            prop="processVersion"
            label="进程版本"
            align="center"
            :show-overflow-tooltip="true"
            width="200px"
          />
          <el-table-column
            prop="programDesc"
            label="进程描述"
            align="center"
            :show-overflow-tooltip="true"
            width="250px"
          />
          <el-table-column
            label="Operation"
            align="center"
            fixed="right"
            width="100px"
          >
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-setting" circle @click="handleManager($event, scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <process-control-modal ref="xProcessControlModal" :current-service="currentService" :current-server-host="currentServerHost" @close="handleClose" />
  </el-row>
</template>

<script>
import QuerySelect from '@/components/QuerySelect'
import ServiceCard from '@/modules/service-control/components/ServiceCard'
import { getAllServerInstance, getProcessByHost } from '@/api/serverManager'
import ProcessControlModal from '@/modules/service-control/modal/ProcessControlModal'

export default {
  name: 'ServiceManager',
  components: { ProcessControlModal, ServiceCard, QuerySelect },
  data() {
    return {
      form: {
        type: ''
      },
      ProcessList: [],
      currentService: {},
      currentServerType: null,
      currentServerHost: null,
      serviceTypeList: [
        { value: 'WebUI_Linux', label: 'WebUI_Linux' },
        { value: 'Cissystem_Linux', label: 'Cissystem_Linux' },
        { value: 'CisServer_Windows', label: 'CisServer_Windows' },
        { value: 'EQLinker_windows', label: 'EQLinker_windows' }
      ],
      serviceInstanceListSource: [],
      serviceInstanceList: [],
      loading: false
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height - 270
    }
  },
  created() {
    this.initInstanceData()
  },
  methods: {
    async initInstanceData() {
      this.loading = true
      const serviceInstanceListRes = await getAllServerInstance()
      if (serviceInstanceListRes && serviceInstanceListRes['res'] && serviceInstanceListRes['res'].length > 0) {
        this.serviceInstanceListSource = serviceInstanceListRes['res']
        this.serviceInstanceList = this.serviceInstanceListSource
        this.currentServerType = this.serviceInstanceList[0]['serviceType']
        this.currentServerHost = (this.serviceInstanceList[0]['serviceHost']).split(':')[0]
        this.getServiceNodeProcess(this.currentServerHost)
      }
      this.loading = false
    },
    handleManager(e, row) {
      e.stopPropagation()
      this.currentService = row
      this.$refs.xProcessControlModal.show()
    },
    handleInstanceClick(data) {
      this.currentServerHost = data['host']
      this.currentServerType = data['type']
      this.getServiceNodeProcess(data['host'])
    },
    getServiceNodeProcess(host) {
      this.loading = true
      const params = { serverHost: host }
      getProcessByHost(params).then(res => {
        if (res && res['res']) {
          this.ProcessList = res['res']
        } else {
          this.$message.warning('该服务实例未上报进程数据')
        }
        this.loading = false
      })
    },
    handlerSearch() {
      if (this.form.type !== '') {
        this.serviceInstanceList = this.serviceInstanceListSource.filter(instance => {
          return instance['serviceType'] === this.form.type
        })
      } else {
        this.serviceInstanceList = this.serviceInstanceListSource
      }
    },
    handleClose() {
      this.getServiceNodeProcess(this.currentServerHost)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-row {
  padding: 5px;
}
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

.content {
  ::v-deep .el-card {
    .el-card__body {
      padding: 10px;
    }
  }
}
.selected-card {
  background-color: #f5ffe5;
}
</style>
