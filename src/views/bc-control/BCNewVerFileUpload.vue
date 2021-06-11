<template>
  <el-row :gutter="5" class="main-row">
    <el-col :span="8">
      <el-card
        header="服务类型列表"
        :body-style="{ height: height - 57 + 'px', padding: '6px', overflowY: 'auto', overflowX: 'hidden'}"
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
          <el-card :header="'版本列表 -- ' + currentService">
            <el-row>
              <el-col :span="24">
                <el-table
                  tooltip-effect="dark"
                  :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
                  :data="displayVersionList"
                  :default-sort="{prop: 'uploadTime', order: 'descending'}"
                  :height="height - 486"
                >
                  <el-table-column
                    prop="folderName"
                    label="文件夹名"
                    sortable
                  />
                  <el-table-column
                    prop="version"
                    label="版本号"
                    sortable
                  />
                  <el-table-column
                    prop="uploadTime"
                    label="上传时间"
                    sortable
                  />
                  <el-table-column
                    prop="uploadUser"
                    label="上传用户"
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
        <el-col :span="24">
          <el-card :style="{height: '380px'}" :header="'程序上传 -- ' + currentService">
            <el-row>
              <el-col :span="24">
                <el-form
                  inline
                  label-position="left"
                  label-width="110px"
                  :model="versionForm"
                  :rules="versionFormRules"
                >
                  <el-form-item label="Version NO." prop="version">
                    <el-input v-model="versionForm.version" style="width: 220px" />
                  </el-form-item>
                  <el-form-item>
                    <el-button :disabled="NewVersionFile.length === 0" type="primary">上传</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="24">
                <el-upload
                  class="upload-new"
                  drag
                  accept=".zip,.rar"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :auto-upload="false"
                  :file-list="NewVersionFile"
                >
                  <i class="el-icon-upload" />
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div slot="tip" class="el-upload__tip">只能上传zip, rar文件</div>
                </el-upload>
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
        version: '1.0.0'
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
          { folderName: '2021061045658', version: '3.2.5', uploadTime: '2021-06-10 12:30:21', uploadUser: 'admin', comment: '修订bug' },
          { folderName: '2021052045658', version: '2.2.9', uploadTime: '2021-05-20 12:12:25', uploadUser: 'admin', comment: '修订bug' },
          { folderName: '2021051145658', version: '1.0.0', uploadTime: '2021-05-12 12:22:10', uploadUser: 'admin', comment: '修订bug' }
        ],
        'EQ LINK SERVICE': [
          { folderName: '2021051245658', version: '1.3.20', uploadTime: '2021-05-12 12:22:10', uploadUser: 'admin', comment: '修订bug' }
        ]
      },
      displayVersionList: [],
      currentService: ''
    }
  },
  computed: {
    height() {
      return (this.$store.getters.body_height - 100) > 800 ? (this.$store.getters.body_height - 100) : 800
    }
  },
  mounted() {
    if (this.versionList) {
      this.currentService = Object.keys(this.versionList)[0]
      this.displayVersionList = this.versionList[this.currentService]
    }
  },
  methods: {
    handleServiceClick(serviceName) {
      this.currentService = serviceName
      this.displayVersionList = this.versionList[serviceName]
    }
  }
}
</script>

<style lang="scss" scoped>
.main-row {
  padding: 5px 5px 0 5px;
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
</style>
