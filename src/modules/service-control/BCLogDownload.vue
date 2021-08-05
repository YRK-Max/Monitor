<template>
  <el-row v-loading="loading" class="main-row" :gutter="6">
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
    <el-col :span="8">
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
    <el-col v-if="isSelectProgram" :span="16">
      <el-card
        header="日志文件目录"
        :body-style="{ padding: '5px' }"
      >
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
          <el-button @click="handleBack">上一级</el-button>
          <div style="flex-grow: 1; background: #fff5eb; padding: 10px; border-radius: 5px; margin: 0 10px 0 10px">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>root</el-breadcrumb-item>
              <el-breadcrumb-item v-for="path in pathList" :key="path['index']">{{ path['fileName'] }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <el-button type="primary">打包</el-button>
          <el-button><a href="javascript: void(0)">下载</a></el-button>
        </div>
        <el-table
          :height="height - 55"
          :data="displayFileList"
          @row-click="handleRowClick"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="fileName"
            label="File Name"
          >
            <template slot-scope="scope">
              <div>
                <i :class="scope.row['type']==='folder'?'el-icon-folder':'el-icon-document'" />
                <label style="margin-left: 10px">{{ scope.row['fileName'] }}</label>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="dateModified"
            label="Date Modified"
          />
          <el-table-column
            prop="type"
            label="File Type"
          />
          <el-table-column
            prop="size"
            label="Size"
          />
        </el-table>
      </el-card>
    </el-col>
    <el-col v-if="!isSelectProgram" :span="16">
      <el-card
        header="已安装程序列表"
        :body-style="{ padding: '5px' }"
      >
        <el-table
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          :height="height - 10"
          :data="tableProgramList"
        >
          <el-table-column
            prop="processName"
            label="程序名称"
          />
          <el-table-column
            prop="processVersion"
            label="程序版本"
          />
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import ServiceCard from '@/modules/service-control/components/ServiceCard'
import { deepClone } from '@/utils'
import { getAllServerInstance, getProcessByHost } from '@/api/serverManager'
export default {
  name: 'BCLogDownload',
  components: { ServiceCard },
  data() {
    return {
      searchForm: {
        service: ''
      },
      serviceTypes: [],
      pathList: [],
      serviceInstanceList: [],
      serviceInstanceListSource: [],
      displayFileList: [],
      tableProgramList: [],
      fileList: [],
      loading: false,
      tableLoading: false,
      currentService: {},
      currentServerType: null,
      currentServerHost: null,
      isSelectProgram: false
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height - 235
    }
  },
  created() {
    this.initInstanceData()
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
        this.serviceInstanceListSource.forEach(InsDS => {
          list.push(InsDS['serviceType'])
        })
        this.serviceTypes = Array.from(new Set(list))
      }
      this.loading = false
    },
    handleRowClick(row) {
      if (row['type'] === 'folder') {
        this.pathList.push({ index: this.pathList.length, fileName: row.fileName })
        this.displayFileList = this.getChildFileList()
      }
    },
    handleInstanceClick(data) {
      this.currentServerHost = data['host']
      this.currentServerType = data['type']
      this.requestProgramList(data)
    },
    async requestProgramList(data) {
      this.tableLoading = true
      const res = await getProcessByHost({ serverHost: data['host'] })
      if (res && res['res']) {
        this.tableProgramList = res['res']
      }
      this.tableLoading = false
    },
    requestFileList(data) {
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
        const currentFolder = result.filter(list => { return list['fileName'] === path['fileName'] })
        if (currentFolder[0] && currentFolder['0']['children']) {
          result = currentFolder[0]['children']
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
</style>
