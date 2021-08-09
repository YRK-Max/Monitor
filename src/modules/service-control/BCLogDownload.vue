<template>
  <el-row v-loading="loading" class="main-row" :gutter="6">
    <el-col :span="8">
      <el-row>
        <el-col :span="24">
          <el-card
            class="params-panel"
            :body-style="{padding: '15px'}"
          >
            <el-form
              inline
              label-position="left"
              label-width="80px"
            >
              <el-form-item label="服务类型">
                <el-select v-model="searchForm.service" style="width: 200px" clearable>
                  <el-option
                    v-for="type in serviceTypes"
                    :key="type"
                    :value="type"
                    :label="type"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handlerSearch">查询</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-card
            header="服务实例列表"
            :body-style="{ height: height + 'px', padding: '5px', overflowY: 'auto', overflowX: 'hidden' }"
          >
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
          </el-card>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-show="isSelectProgram" :span="16">
      <el-card
        :body-style="{ padding: '5px' }"
      >
        <div slot="header" class="clearfix">
          <span>日志文件目录</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="handleBackToProgramList"><i class="yicon-common yiconback" />返回程序目录</el-button>
        </div>
        <div class="info-panel">
          <el-select v-model="logForm.logId" placeholder="请选择日志类型" @change="handleLogTypeChange">
            <el-option
              v-for="item in logParams"
              :key="item.logId"
              :label="item.name"
              :value="item.logId"
            />
          </el-select>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
          <el-button circle icon="el-icon-back" type="primary" size="mini" style="width: 30px; height: 30px;margin: 3px 0 0 5px" @click="handleBack" />
          <div style="flex-grow: 1; background: #fff5eb; padding: 10px; border-radius: 5px; margin: 0 10px 0 10px">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>root</el-breadcrumb-item>
              <el-breadcrumb-item v-for="path in pathList" :key="path['index']">{{ path['FileName'] }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <el-button type="primary" size="small" :loading="takeFilePckLoading" @click="takePckOfLog">{{ takePckText }}</el-button>
        </div>
        <el-table
          ref="xFileList"
          v-loading="tableOfFileLoading"
          :height="height - 42"
          :data="displayFileList"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="FileName"
            label="File Name"
          >
            <template slot-scope="scope">
              <div>
                <i :class="scope.row['Type']==='folder'?'el-icon-folder':'el-icon-document'" />
                <label style="margin-left: 10px">{{ scope.row['FileName'] }}</label>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="DateModified"
            label="Date Modified"
          />
          <el-table-column
            prop="Type"
            label="File Type"
          >
            <template slot-scope="scope">
              <label>{{ scope.row['Type'] }}</label>
            </template>
          </el-table-column>
          <el-table-column
            prop="Size"
            label="Size"
          >
            <template slot-scope="scope">
              <label>{{ scope.row['Size'] }}</label>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col v-show="!isSelectProgram" :span="16">
      <el-card
        header="已安装程序列表"
        :body-style="{ padding: '5px' }"
      >
        <el-table
          ref="xTableProgram"
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          :height="height + 68"
          :data="tableProgramList"
        >
          <el-table-column
            prop="processName"
            label="程序名称"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="processArgs"
            label="程序运行参数"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              <label>{{ scope.row['processArgs'] }}</label>
            </template>
          </el-table-column>
          <el-table-column
            prop="processVersion"
            label="程序版本"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="isCISProgram"
            label="CIS程序"
            align="center"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row['isCISProgram']"
                :disabled="true"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleLogView(scope.row)">查看日志</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import ServiceCard from '@/modules/service-control/components/ServiceCard'
import { deepClone } from '@/utils'
import { getAllServerInstance, getLogFileTrees, getProcessByHost, takeFilePck } from '@/api/serverManager'
import { getPackgeList } from '@/api/monitor'
export default {
  name: 'BCLogDownload',
  components: { ServiceCard },
  data() {
    return {
      searchForm: {
        service: ''
      },
      logForm: {
        logId: ''
      },
      logParams: [],
      serviceTypes: [],
      pathList: [],
      packageList: [],
      serviceInstanceList: [],
      serviceInstanceListSource: [],
      displayFileList: [],
      tableProgramList: [],
      fileList: [],
      loading: false,
      tableLoading: false,
      tableOfFileLoading: false,
      currentService: {},
      currentServerType: null,
      currentServerHost: null,
      currentPckInfo: null,
      isSelectProgram: false,
      selectedFilePaths: [],
      takeFilePckLoading: false,
      takePckText: '打包&下载'
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height - 235
    }
  },
  created() {
    this.initInstanceData()
    this.initPackageData()
  },
  methods: {
    async initInstanceData() {
      this.loading = true
      const list = []
      const serviceInstanceListRes = await getAllServerInstance()
      if (serviceInstanceListRes && serviceInstanceListRes['res'] && serviceInstanceListRes['res'].length > 0) {
        this.serviceInstanceListSource = serviceInstanceListRes['res']
        this.serviceInstanceList = this.serviceInstanceListSource
        this.currentServerType = this.serviceInstanceList[0]['serviceType']
        this.currentServerHost = (this.serviceInstanceList[0]['serviceHost']).split(':')[0]
        await this.requestProgramList(this.currentServerHost)
        this.serviceInstanceListSource.forEach(InsDS => {
          list.push(InsDS['serviceType'])
        })
        this.serviceTypes = Array.from(new Set(list))
      }
      this.loading = false
    },
    initPackageData() {
      getPackgeList().then(res => {
        if (res && res['res']) {
          this.packageList = res['res']
        }
      })
    },
    handleRowClick(row) {
      if (row['Type'] === 'folder') {
        this.pathList.push({ index: this.pathList.length, FileName: row['FileName'] })
        this.displayFileList = this.getChildFileList()
      }
    },
    handleSelectionChange(data) {
      this.selectedFilePaths = []
      data.forEach(d => {
        this.selectedFilePaths.push(d['Path'])
      })
    },
    handleInstanceClick(data) {
      this.isSelectProgram = false
      this.currentServerHost = data['host']
      this.currentServerType = data['type']
      this.requestProgramList(this.currentServerHost)
    },
    async requestProgramList(host) {
      this.tableLoading = true
      this.tableProgramList = []
      const res = await getProcessByHost({ serverHost: host })
      if (res && res['res']) {
        const result = res['res']
        result.forEach(r => {
          const list_r = this.tableProgramList.filter(tp => { return tp['processName'] === r['processName'] && tp['processVersion'] === r['processVersion'] })
          const pckInfo = this.packageList.filter(p => { return p['programName'] === r['processName'] && p['programVersion'] === r['processVersion'] })
          if (list_r.length <= 0) {
            if (pckInfo.length > 0) {
              r['pckInfo'] = pckInfo[0]
            }
            this.tableProgramList.push(r)
          }
        })
      }
      this.tableLoading = false
    },
    requestFileList() {
      this.pathList = []
      this.displayFileList = this.getChildFileList()
    },
    handleBack() {
      this.pathList.pop()
      this.displayFileList = this.getChildFileList()
    },
    getChildFileList() {
      let result = deepClone(this.fileList)
      this.pathList.forEach(path => {
        const currentFolder = result.filter(list => { return list['FileName'] === path['FileName'] })
        if (currentFolder[0] && currentFolder['0']['Children']) {
          result = currentFolder[0]['Children']
        }
      })
      return result
    },
    handlerSearch() {
      if (this.searchForm.service !== '') {
        this.serviceInstanceList = this.serviceInstanceListSource.filter(instance => {
          return instance['serviceType'] === this.searchForm.service
        })
      } else {
        this.serviceInstanceList = this.serviceInstanceListSource
      }
    },
    handleLogView(row) {
      if (row['pckInfo'] && row['pckInfo']['logParameters'].length > 0) {
        const logParameters = row['pckInfo']['logParameters']
        this.isSelectProgram = true
        this.logParams = logParameters
        this.logForm.logId = logParameters[0]['logId']
        this.currentPckInfo = row['pckInfo']
        this.refreshFileList()
      } else {
        this.$message.error('该程序未设置日志参数')
      }
    },
    handleBackToProgramList() {
      this.isSelectProgram = false
    },
    refreshFileList() {
      this.tableOfFileLoading = true
      getLogFileTrees({ serviceHost: this.currentServerHost, programPackageId: this.currentPckInfo['programPackageId'], logId: this.logForm.logId }).then(res => {
        if (res && res['status']) {
          this.fileList = JSON.parse(res['res'])
          this.requestFileList()
          this.tableOfFileLoading = false
        } else {
          this.$message.error(res['mesg'])
          this.displayFileList = []
          this.tableOfFileLoading = false
        }
      })
    },
    takePckOfLog() {
      this.takeFilePckLoading = true
      this.takePckText = '打包中'
      takeFilePck(this.currentPckInfo['programPackageId'], { serviceHost: this.currentServerHost, programPackageId: this.currentPckInfo['programPackageId'] }, this.selectedFilePaths).then(res => {
        this.takePckText = '打包&下载'
        if (res && res['status']) {
          this.$message.success('打包完成')
          window.open(res['res']['fileUrl'])
        } else {
          this.$message.error('打包失败' + res['mesg'])
        }
      }).finally(() => {
        this.takeFilePckLoading = false
      })
    },
    handleLogTypeChange(data) {
      this.logForm.logId = data
      this.refreshFileList()
    }
  }
}
</script>

<style lang="scss" scoped>
.main-row {
  padding: 5px;
  ::v-deep .el-form-item {
    margin-bottom: 5px;
  }
  ::v-deep .el-col {
    margin-bottom: 5px;
  }
}
.selected-card {
  background-color: #f5ffe5;
}
.info-panel {
  background: aliceblue;
  border: 1px solid #558cff;
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 10px;
}
</style>
