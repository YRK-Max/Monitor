<template>
  <el-row v-loading="loading" class="main-row">
    <el-col :span="24" style="margin: 5px 0 5px 10px">
      <label>Host : </label><span>{{ currentServer.host }}</span>
    </el-col>
    <el-col :span="24">
      <div style="padding: 6px">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
    </el-col>
    <el-col :span="24">
      <el-card
        style="margin-left: 5px; width: calc(100% - 10px)"
        :body-style="{ padding: '5px' }"
        header
      >
        <div slot="header" class="clearfix">
          <span>进程列表</span>
        </div>
        <el-table
          :data="ConfList"
          :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
          tooltip-effect="dark"
          :height="height+26"
        >
          <el-table-column
            type="index"
            label="#"
            width="50"
          />
          <el-table-column
            prop="confId"
            label="Cofig ID"
            width="200px"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="programConfName"
            label="program Conf Name"
            align="center"
            width="200px"
          />
          <el-table-column
            prop="programRunCount"
            label="Program Run Count"
            align="center"
            :show-overflow-tooltip="true"
            width="200px"
          />
          <el-table-column
            prop="programArgs"
            label="Program Args"
            align="center"
            :show-overflow-tooltip="true"
            width="200px"
          />
          <el-table-column
            prop="programKillOld"
            label="Program Kill Old"
            align="center"
            :show-overflow-tooltip="true"
            width="200px"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row['programKillOld']"
                :disabled="true"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="programStartCommand"
            label="Program Start Command"
            align="center"
            :show-overflow-tooltip="true"
            width="250px"
          />
          <el-table-column
            prop="programStopCommand"
            label="Program Stop Command"
            align="center"
            :show-overflow-tooltip="true"
            width="250px"
          />
          <el-table-column
            prop="programExecuteFile"
            label="Program Execute File"
            align="center"
            :show-overflow-tooltip="true"
            width="250px"
          />
          <el-table-column
            prop="programExecuteFileEnable"
            label="Program Execute File Enable"
            align="center"
            :show-overflow-tooltip="true"
            width="250px"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row['programExecuteFileEnable']"
                :disabled="true"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="programRunPath"
            label="Program Run Path"
            align="center"
            :show-overflow-tooltip="true"
            width="250px"
          />
          <el-table-column
            prop="programPackgePath"
            label="Program Packge Path"
            align="center"
            :show-overflow-tooltip="true"
            width="250px"
          />
          <el-table-column
            fixed="right"
            label="操作"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <program-config-modal ref="xProgramConfigModal" :current-server-host="currentServer.host" :current-server-type="currentServer.type" />
  </el-row>
</template>

<script>
import { getProgramConf } from '@/api/monitor'
import ProgramConfigModal from '@/modules/service-control/modal/ProgramConfigModal'

export default {
  name: 'ServiceManager',
  components: { ProgramConfigModal },
  data() {
    return {
      currentServer: {
        type: null,
        host: null
      },
      form: {
        type: ''
      },
      ConfList: [],
      currentService: {},
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
  watch: {
    '$route'(val) {
      this.currentServer.host = val.query.host
      this.currentServer.type = val.query.type
      this.initInstanceData()
    }
  },
  created() {
    this.currentServer.host = this.$route.query.host
    this.currentServer.type = this.$route.query.type
    this.initInstanceData()
  },
  methods: {
    async initInstanceData() {
      this.loading = true
      this.getProgramConfig()
      this.loading = false
    },
    handleManager(e, row) {
      e.stopPropagation()
      this.currentService = row
    },
    getProgramConfig() {
      this.loading = true
      const params = { serviceHost: this.currentServer.host }
      getProgramConf(params).then(res => {
        if (res && res['res']) {
          this.ConfList = res['res']
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
    handleDelete(row) {
      console.log(row)
    },
    handleAdd() {
      this.$refs.xProgramConfigModal.show()
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
</style>
