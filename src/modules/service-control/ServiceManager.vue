<template>
  <el-row class="main-row">
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
        <div class="content enable-y-scroll no-scroll-bar" :style="{ height: (height + 5) + 'px' }">
          <service-card
            v-for="instance in serviceInstanceList"
            :key="instance['serviceHost']"
            type="instance"
            style="margin-bottom: 3px"
            :hostname="instance['serviceHost'].split(':')[0]"
            :description="instance['sysVersion']"
            :title="instance['serviceType']"
            :os="instance['sysName']"
            @click="handleInstanceClick"
          />
        </div>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card
        style="margin: 5px; width: calc(100% - 10px)"
        header
      >
        <div slot="header" class="clearfix">
          <span>进程列表</span>
        </div>
        <el-table
          :data="ProcessList"
          :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
          tooltip-effect="dark"
          :height="height"
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
            :show-overflow-tooltip="true"
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
  </el-row>
</template>

<script>
import QuerySelect from '@/components/QuerySelect'
import ServiceCard from '@/modules/service-control/components/ServiceCard'
import { getAllServiceInstance, getProcessByHost } from '@/api/monitor'

export default {
  name: 'ServiceManager',
  components: { ServiceCard, QuerySelect },
  data() {
    return {
      form: {
        type: ''
      },
      ProcessList: [],
      currentService: {
        job: '',
        health: 'up',
        instance: ''
      },
      serviceTypeList: [
        { value: 'WebUI_Linux', label: 'WebUI_Linux' },
        { value: 'Cissystem_Linux', label: 'Cissystem_Linux' },
        { value: 'CisServer_Windows', label: 'CisServer_Windows' },
        { value: 'EQLinker_windows', label: 'EQLinker_windows' }
      ],
      serviceInstanceListSource: [],
      serviceInstanceList: []
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
      this.serviceInstanceListSource = await getAllServiceInstance()
      this.serviceInstanceList = this.serviceInstanceListSource
    },
    handleManager(e, row) {
      e.stopPropagation()
      this.currentService = row
    },
    handleInstanceClick(data) {
      const params = { requestType: -1, serverHost: data }
      getProcessByHost(params).then(res => {
        // 未完待续
        console.log(res)
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

.content {
  ::v-deep .el-card {
    .el-card__body {
      padding: 10px;
    }
  }
}
</style>
