<template>
  <el-row v-loading="fullScreenLoading" :gutter="5" class="main-row">
    <el-col :span="8">
      <el-card
        header="程序类型列表"
        :body-style="{padding: '6px', height: height + 'px', overflowY: 'auto', overflowX: 'hidden'}"
      >
        <service-card
          v-for="service in services"
          :key="services.indexOf(service)"
          style="margin-bottom: 3px"
          :class="[currentService===service['programName']?'selected-card':'']"
          :title="service['programName']"
          :service-name="service['programName']"
          :version="service['version']"
          :description="service['desc']"
          :is-manager="true"
          @click="handleServiceClick"
          @manage="handleProgramManage"
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
                    :key="displayVersionList.indexOf(version)"
                    :label="version['programVersion']"
                    :value="version['programVersion']"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">更新选中的实例</el-button>
                <el-button type="primary" @click="handlerFileUpload">上传更新包&更新所有实例</el-button>
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
                  stripe
                >
                  <el-table-column
                    type="selection"
                    width="55"
                  />
                  <el-table-column
                    type="index"
                    label="NO."
                    width="50"
                  />
                  <el-table-column
                    prop="serviceHost"
                    label="实例"
                    sortable
                    align="center"
                  />
                  <el-table-column
                    prop="serviceType"
                    label="服务器类型"
                    align="center"
                  />
                  <el-table-column
                    prop="sysName"
                    label="系统名称"
                    align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    prop="sysVersion"
                    label="系统版本"
                    sortable
                    align="center"
                  />
                </el-table>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
    <package-file-upload-modal ref="PacFileModal" />
    <ProgramManageModal ref="xModalProgramManage" :program-name="currentProgramManage" :package-list="currentPackageList" />
  </el-row>
</template>

<script>
import ServiceCard from '@/modules/service-control/components/ServiceCard'
import PackageFileUploadModal from '@/modules/service-control/modal/PackageFileUploadModal'
import { getPackgeList, getServerListByProgramInfo } from '@/api/monitor'
import ProgramManageModal from '@/modules/service-control/modal/ProgramManageModal'
export default {
  name: 'BCNewVerFileUpload',
  components: { ProgramManageModal, PackageFileUploadModal, ServiceCard },
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
      allServicesInfo: [],
      services: [],
      displayVersionList: [],
      displayInstanceList: [],
      currentService: '',
      currentProgramManage: '',
      currentPackageList: [],
      fullScreenLoading: false,
      tableLoading: false
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height - 160
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      this.fullScreenLoading = true
      const res = await getPackgeList()
      const programName = []
      if (res && res['res']) {
        this.allServicesInfo = res['res']
        this.allServicesInfo.forEach(l => {
          const p = l['programName']
          const v = l['programVersion']
          const d = l['programDesc']
          const l_t = programName.filter((pt) => { return pt['programName'] === p })
          if (l_t.length === 0) {
            programName.push({ programName: p, version: v, desc: d })
          } else {
            if (v > l_t[0]['version']) {
              l_t[0]['version'] = v
            }
          }
        })
        this.services = programName
        if (this.services.length > 0) {
          this.currentService = this.services[0]['programName']
          this.refreshSelectData()
          this.refreshTableData()
        }
      }

      this.fullScreenLoading = false
    },
    refreshSelectData() {
      const v_list = []
      const list = this.allServicesInfo.filter(ser => { return ser['programName'] === this.currentService })
      list.forEach(l => {
        if (v_list.filter(vl => { return vl['programVersion'] === l['programVersion'] }).length === 0) {
          v_list.push({ programVersion: l['programVersion'] })
        }
      })
      this.displayVersionList = v_list
    },
    refreshTableData() {
      this.tableLoading = true
      const params = { programName: this.currentService }
      getServerListByProgramInfo(params).then(res => {
        if (res && res['res']) {
          this.tableLoading = false
          this.displayInstanceList = res['res']
        }
      })
    },
    handleServiceClick(serviceName) {
      this.$refs['VersionForm'].resetFields()
      this.currentService = serviceName
      this.refreshSelectData()
      this.refreshTableData()
    },
    handlerFileUpload() {
      this.$refs.PacFileModal.show()
    },
    handleProgramManage(data) {
      this.currentProgramManage = data['programName']
      this.currentPackageList = this.allServicesInfo.filter(ser => { return ser['programName'] === data['programName'] })
      this.$refs.xModalProgramManage.show()
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
.selected-card {
  background-color: #f5ffe5;
}
</style>
