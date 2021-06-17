<template>
  <el-row class="main-row" :gutter="6">
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
          <el-form-item label="服务">
            <el-select v-model="searchForm.service" style="width: 200px">
              <el-option
                v-for="service in services"
                :key="service.serviceName"
                :value="service.serviceName"
                :label="service.title"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
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
          :key="instance.hostname"
          type="instance"
          style="margin-bottom: 3px"
          :hostname="instance.hostname"
          :description="instance.description"
          :title="instance.title"
          :os="instance.os"
          @click="handleServiceCardClick"
        />
      </el-card>
    </el-col>
    <el-col :span="16">
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
  </el-row>
</template>

<script>
import ServiceCard from '@/modules/service-control/components/ServiceCard'
import { deepClone } from '@/utils'
export default {
  name: 'BCLogDownload',
  components: { ServiceCard },
  data() {
    return {
      searchForm: {
        service: ''
      },
      services: [
        { title: 'BC', serviceName: 'CIS SYSTEM', version: '3.2.5', description: '用于采集设备数据以及发送控制指令的程序服务' },
        { title: 'EQ-LINK', serviceName: 'EQ LINK SERVICE', version: '1.3.20', description: '消息中间件服务' }
      ],
      pathList: [],
      serviceInstanceList: [
        { hostname: '10.3.5.168:2020', description: 'LINE1#CUT1', title: 'CIS SYSTEM', os: 'Windows' },
        { hostname: '10.3.5.113:8080', description: 'Report', title: 'OTHER', os: 'Linux' },
        { hostname: '10.3.5.135:2020', description: 'LINE1#CUT1', title: 'CIS SYSTEM', os: 'Windows' }
      ],
      displayFileList: [],
      fileList: []
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height - 235
    }
  },
  mounted() {
    if (this.serviceInstanceList && this.serviceInstanceList[0]) {
      this.requestFileList(this.serviceInstanceList[0]['hostname'])
    }
  },
  methods: {
    handleRowClick(row) {
      if (row['type'] === 'folder') {
        this.pathList.push({ index: this.pathList.length, fileName: row.fileName })
        this.displayFileList = this.getChildFileList()
      }
    },
    handleServiceCardClick(data) {
      this.requestFileList(data)
    },
    requestFileList(data) {
      this.pathList = []
      // 模拟数据请求
      setTimeout(() => {
        if (data === '10.3.5.168:2020') {
          this.fileList = [
            {
              fileName: '202105245658', dateModified: '2021-05-24 12:45:12', type: 'folder', size: '',
              children: [
                {
                  fileName: '202105245658', dateModified: '2021-05-24 12:45:12', type: 'folder', size: '',
                  children: [
                    { fileName: '202105284568', dateModified: '2021-05-24 12:45:12', type: 'log', size: '102k' },
                    { fileName: '202106102546', dateModified: '2021-05-24 12:45:12', type: 'log', size: '200k' }
                  ]
                },
                { fileName: '202105284568', dateModified: '2021-05-24 12:45:12', type: 'log', size: '2k' },
                { fileName: '202106102546', dateModified: '2021-05-24 12:45:12', type: 'log', size: '856k' }
              ]
            }
          ]
        } else if (data === '10.3.5.113:8080') {
          this.fileList = [
            {
              fileName: '202105245658', dateModified: '2021-05-24 12:45:12', type: 'folder', size: '',
              children: [
                {
                  fileName: '202105245658', dateModified: '2021-05-24 12:45:12', type: 'folder', size: '',
                  children: [
                    { fileName: '202105284568', dateModified: '2021-05-24 12:45:12', type: 'log', size: '102k' },
                    { fileName: '202106102546', dateModified: '2021-05-24 12:45:12', type: 'log', size: '200k' }
                  ]
                },
                { fileName: '202105284568', dateModified: '2021-05-24 12:45:12', type: 'log', size: '2k' },
                { fileName: '202106102546', dateModified: '2021-05-24 12:45:12', type: 'log', size: '856k' }
              ]
            },
            {
              fileName: '202106115658', dateModified: '2021-05-24 12:45:12', type: 'folder', size: '',
              children: [
                {
                  fileName: '202105245658', dateModified: '2021-05-24 12:45:12', type: 'folder', size: '',
                  children: []
                },
                { fileName: '202105284568', dateModified: '2021-05-24 12:45:12', type: 'log', size: '2k' },
                { fileName: '202106102546', dateModified: '2021-05-24 12:45:12', type: 'log', size: '856k' }
              ]
            }
          ]
        } else { this.fileList = [] }
        this.displayFileList = this.getChildFileList()
      }, 100)
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
</style>
