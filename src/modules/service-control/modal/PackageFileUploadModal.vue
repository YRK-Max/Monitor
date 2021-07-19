<template>
  <el-dialog
    title="程序包上传"
    :visible.sync="visible"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="main-dialog"
    :show-close="false"
  >
    <el-form
      ref="xFormUploadFile"
      v-loading="fileLoading"
      :model="formData"
      :rules="rules"
      label-width="100px"
      label-position="left"
      class="FileUploadForm"
    >
      <el-col :span="12">
        <el-form-item label="程序名" prop="programName"><el-input v-model="formData.programName" /></el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="版本号" prop="programVersion"><el-input v-model="formData.programVersion" /></el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="CIS程序">
          <el-switch
            v-model="formData.isCISProgram"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Is Agent">
          <el-switch
            v-model="formData.isAgent"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="要安装的实例">
          <el-select
            v-model="installInstanceList"
            style="width: 100%"
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in instanceList"
              :key="instanceList.indexOf(item)"
              :label="item['serviceHost'].split(':')[0]"
              :value="item['serviceHost'].split(':')[0]"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="程序描述" prop="programDesc"><el-input v-model="formData.programDesc" /></el-form-item>
      </el-col>
      <el-card
        shadow="none"
      >
        <div
          style="display: flex; justify-content: space-between"
        >
          <label>Log 配置</label>
          <div>
            <el-button plain type="primary" icon="el-icon-plus" size="mini" circle @click="handlerAddLogConf" />
          </div>
        </div>
        <el-table
          ref="xTableOfLogParams"
          style="margin: 10px 0 0 0"
          :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
          :data="logConfList"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="name"
            label="名称"
            width="180"
          >
            <template slot-scope="scope">
              <label v-if="!scope.row['isSet']">{{ scope.row['name'] }}</label>
              <el-input v-if="scope.row['isSet']" v-model="scope.row['name']" />
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            width="180"
          >
            <template slot-scope="scope">
              <label v-if="!scope.row['isSet']">{{ scope.row['type'] }}</label>
              <el-input v-if="scope.row['isSet']" v-model="scope.row['type']" />
            </template>
          </el-table-column>
          <el-table-column
            prop="path"
            label="路径"
          >
            <template slot-scope="scope">
              <label v-if="!scope.row['isSet']">{{ scope.row['path'] }}</label>
              <el-input v-if="scope.row['isSet']" v-model="scope.row['path']" />
            </template>
          </el-table-column>
          <el-table-column width="100" label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row['isSet']" type="text" size="small" @click="handleSave(scope.row)">保存</el-button>
              <el-button v-if="!scope.row['isSet']" type="text" size="small" @click="handleEdit(scope.row)">修改</el-button>
              <el-divider direction="vertical" />
              <el-button v-if="scope.row['isSet']" type="text" size="small" @click="handleCancel(scope.row)">取消</el-button>
              <el-button v-if="!scope.row['isSet']" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-upload
        ref="XRefUpload"
        style="width: 100%; margin: 10px 0 10px 0"
        drag
        action=""
        accept=".zip,.rar"
        :show-file-list="false"
        :multiple="false"
        :http-request="handlerFileUpload"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传zip/rar文件</div>
      </el-upload>
      <el-col :span="12">
        <el-form-item label="文件ID"><el-input v-model="formData.programFileData.fileID" disabled /></el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="文件名称"><el-input v-model="formData.programFileData.fileName" disabled /></el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="文件大小"><el-input v-model="formData.programFileData.fileSize" disabled /></el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建时间"><el-input v-model="formData.programFileData.fileCreateTime" disabled /></el-form-item>
      </el-col>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="submitLoading" @click="visible = false">取 消</el-button>
      <el-button :disabled="isComplete" type="primary" :loading="submitLoading" @click="handlerSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAllServiceInstance, upload_file, upload_program } from '@/api/monitor'

export default {
  name: 'PackageFileUploadModal',
  data() {
    return {
      visible: false,
      fileLoading: false,
      submitLoading: false,
      formData: {
        isCISProgram: true,
        fileId: '',
        programDesc: '',
        programName: '',
        isAgent: true,
        programVersion: '',
        logParameters: [],
        programFileData: {
          fileID: '',
          fileName: '',
          fileUrl: '',
          ftpUserName: '',
          ftpPassWord: '',
          fileLength: 0,
          fileSize: '',
          fileType: '',
          fileDownLoadCount: 0,
          fileCreateTime: '',
          fileUpdateTime: '',
          createUser: '',
          updateUser: ''
        }
      },
      logConfList: [],
      rules: {
        programName: [{ required: true }],
        programVersion: [{ required: true }],
        programDesc: [{ required: true }]
      },
      isComplete: true,
      instanceList: [],
      installInstanceList: []
    }
  },
  mounted() {
    this.initSelect()
  },
  methods: {
    show() {
      this.visible = true
    },
    close() {
      this.visible = false
    },
    initSelect() {
      getAllServiceInstance().then(res => {
        if (res && res['res']) {
          this.instanceList = res['res']
        }
      })
    },
    handlerFileUpload(params) {
      if (params && params.file) {
        this.fileLoading = true
        const form = new FormData()
        form.set('File', params.file)
        upload_file(form).then(res => {
          if (res && res['res']) {
            this.formData.fileId = res['res']['fileID']
            this.formData.programFileData = res['res']
            this.isComplete = false
          }
          this.fileLoading = false
        })
      } else {
        this.$message.error('传入文件参数有误')
      }
    },
    handlerSubmit() {
      this.submitLoading = true
      console.log(this.formData)
      this.$refs.xFormUploadFile.validate(async(valid) => {
        if (valid) {
          for (const instance of this.installInstanceList) {
            const res = await upload_program(this.formData, { serverHost: instance })
            if (res['code'] === 200) {
              if (this.installInstanceList.indexOf(instance) === (this.installInstanceList.length - 1)) {
                this.$message.success('更新成功')
                this.submitLoading = false
              }
            } else {
              this.$message.error(instance + ' -- 更新失败')
              this.submitLoading = false
            }
          }
        }
      })
    },
    handlerAddLogConf() {
      if (this.logConfList.length === 0 || !this.logConfList[this.logConfList.length - 1]['isSet']) {
        const logConf = { name: '', type: '', path: '', isSet: true }
        this.logConfList.push(logConf)
      }
    },
    handleSave(row) {
      const row_real = JSON.parse(JSON.stringify(row))
      row['isSet'] = false
      delete row_real['isSet']
      this.formData.logParameters.push(row_real)
    },
    handleEdit(row) {
      row['isSet'] = true
    },
    handleCancel(row) {
      row['isSet'] = false
      this.logConfList.splice(this.logConfList.indexOf(row), 1)
    },
    handleDelete(row) {
      const row_real = JSON.parse(JSON.stringify(row))
      this.logConfList.splice(this.logConfList.indexOf(row), 1)
      delete row_real['isSet']
    }
  }
}
</script>

<style lang="scss" scoped>
.main-dialog {
  ::v-deep .el-upload{
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }

  ::v-deep .el-dialog__body {
    height: 450px;
    overflow-y: auto;
  }
}

.FileUploadForm {
  ::v-deep .el-form-item__content {
    margin-right: 10px;
  }
}
</style>
