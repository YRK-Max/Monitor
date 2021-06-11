<template>
  <el-row :gutter="5" class="main-row">
    <el-col :span="8">
      <el-card
        header="服务类型列表"
        :body-style="{padding: '6px', height: height + 'px', overflowY: 'auto', overflowX: 'hidden'}"
      >
        <service-card
          v-for="service in services"
          :key="service['serviceName']"
          style="margin-bottom: 3px"
          :title="service['title']"
          :service-name="service['serviceName']"
          :version="service['version']"
          :description="service['description']"
          @click="handleServiceClick"
        />
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-row>
        <el-col :span="24">
          <el-card class="panel-card">
            <el-form
              ref="VersionForm"
              inline
              label-position="left"
              label-width="140px"
              :model="versionForm"
              :rules="versionFormRules"
            >
              <el-form-item label="选择要更新的版本" prop="version">
                <el-select v-model="versionForm.version">
                  <el-option
                    v-for="version in displayVersionList"
                    :key="version['version']"
                    :label="version['version']"
                    :value="version['version']"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">更新选中的实例</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-card :header="'服务实例列表 -- ' + currentService">
            <el-row>
              <el-col :span="24">
                <el-table
                  tooltip-effect="dark"
                  :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
                  :data="displayInstanceList"
                  :default-sort="{prop: 'uploadTime', order: 'descending'}"
                  :height="height - 128"
                >
                  <el-table-column
                    type="selection"
                    width="55"
                  />
                  <el-table-column
                    type="index"
                    width="50"
                  />
                  <el-table-column
                    prop="instance"
                    label="实例"
                    sortable
                  />
                  <el-table-column
                    prop="version"
                    label="当前版本号"
                    sortable
                  />
                  <el-table-column
                    prop="comment"
                    label="备注"
                    :show-overflow-tooltip="true"
                  />
                </el-table>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import ServiceCard from '@/views/bc-control/components/ServiceCard'
export default {
  name: 'BCNewVerFileUpload',
  components: { ServiceCard },
  data() {
    return {
      versionForm: {
        version: ''
      },
      versionFormRules: {
        version: [
          { required: true, message: '版本号不能为空' }
        ]
      },
      BCSearchForm: {
        ip: ''
      },
      NewVersionFile: [],
      services: [
        { title: 'BC', serviceName: 'CIS SYSTEM', version: '3.2.5', description: '用于采集设备数据以及发送控制指令的程序服务' },
        { title: 'EQ-LINK', serviceName: 'EQ LINK SERVICE', version: '1.3.20', description: '消息中间件服务' }
      ],
      versionList: {
        'CIS SYSTEM': [
          { version: '3.2.5', uploadTime: '2021-06-10 12:30:21', uploadUser: 'admin', comment: '修订bug' },
          { version: '2.2.9', uploadTime: '2021-05-20 12:12:25', uploadUser: 'admin', comment: '修订bug' },
          { version: '1.0.0', uploadTime: '2021-05-12 12:22:10', uploadUser: 'admin', comment: '修订bug' }
        ],
        'EQ LINK SERVICE': [
          { version: '1.3.20', uploadTime: '2021-05-12 12:22:10', uploadUser: 'admin', comment: '修订bug' }
        ]
      },
      displayVersionList: [],
      serviceInstanceList: [
        { version: '3.2.5', instance: '10.3.5.122:6255', uploadUser: 'admin', comment: 'LINE1#CUT1', service: 'CIS SYSTEM' },
        { version: '2.2.9', instance: '10.3.5.112:6255', uploadUser: 'admin', comment: 'LINE1#CUT1', service: 'CIS SYSTEM' },
        { version: '1.0.0', instance: '10.3.5.123:6255', uploadUser: 'admin', comment: 'LINE1#BND1', service: 'CIS SYSTEM' },
        { version: '1.3.20', instance: '10.3.5.122:5862', uploadUser: 'admin', comment: '修订bug', service: 'EQ LINK SERVICE' }
      ],
      displayInstanceList: [],
      currentService: ''
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height - 160
    }
  },
  mounted() {
    if (this.versionList) {
      this.currentService = Object.keys(this.versionList)[0]
      this.displayVersionList = this.versionList[this.currentService]
      this.displayInstanceList = this.serviceInstanceList.filter(instance => { return instance['service'] === this.currentService })
    }
  },
  methods: {
    handleServiceClick(serviceName) {
      this.$refs['VersionForm'].resetFields()
      this.currentService = serviceName
      this.displayVersionList = this.versionList[serviceName]
      this.displayInstanceList = this.serviceInstanceList.filter(instance => { return instance['service'] === serviceName })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-row {
  margin-top: 5px;
  padding: 0 5px 0 5px;
  ::v-deep .el-col {
    margin-bottom: 5px;
  }
}
.upload-new {
  ::v-deep .el-upload{
    width: 100%;
  }
  ::v-deep .el-upload-dragger {
    width: 100%;
  }
}
.panel-card {
  ::v-deep .el-form-item{
    margin-bottom: 0;
  }
}
</style>
