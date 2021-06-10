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
        :body-style="{ height: '730px', padding: '5px' }"
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
        />
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card
        header="日志文件目录"
        :body-style="{ height: '730px', padding: '5px' }"
      >
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px">
          <el-button @click="handleBack">上一级</el-button>
          <div style="flex-grow: 1; background: #fff5eb; padding: 10px; border-radius: 5px; margin: 0 10px 0 10px">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>root</el-breadcrumb-item>
              <el-breadcrumb-item v-for="path in pathList" :key="path">{{ path }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <el-button type="primary">打包下载</el-button>
        </div>
        <el-table
          :height="675"
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
          />
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
import ServiceCard from '@/views/bc-control/components/ServiceCard'
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
      fileList: [
        { fileName: '202105245658', dateModified: '2021-05-24 12:45:12', type: 'File folder', size: '',
          children: [
            { fileName: '202105245658', dateModified: '2021-05-24 12:45:12', type: 'log', size: '' },
            { fileName: '202105284568', dateModified: '2021-05-24 12:45:12', type: 'log', size: '' },
            { fileName: '202106102546', dateModified: '2021-05-24 12:45:12', type: 'log', size: '' }
          ]
        }
      ]
    }
  },
  mounted() {
    this.displayFileList = this.fileList
  },
  methods: {
    handleRowClick(row) {
      this.pathList.push(row.fileName)
      this.displayFileList = this.fileList.filter(file => { return file.fileName === row.fileName })[0].children
    },
    handleBack() {
      this.pathList.pop()
      if (this.pathList.length === 0) {
        this.displayFileList = this.fileList
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
    margin-bottom: 10px;
  }
}
</style>
