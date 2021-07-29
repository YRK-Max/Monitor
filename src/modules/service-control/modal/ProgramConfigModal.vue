<template>
  <el-dialog
    title="操作"
    :visible.sync="dialogVisible"
    width="520px"
    class="main-dialog"
    @close="handlerDialogClose"
  >
    <el-form
      ref="xProgramConfigForm"
      :model="programConfigForm"
      :rules="programConfigFormRules"
      label-position="left"
      label-width="100px"
    >
      <el-col :span="24">
        <el-form-item label="配置名称" prop="programConfName">
          <el-input v-model="programConfigForm.programConfName" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="服务器 Host" prop="programConfName">
          <el-input v-model="programConfigForm.serverHost" :disabled="true" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="服务器类型" prop="programConfName">
          <el-input v-model="programConfigForm.serverType" :disabled="true" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="程序名称" prop="programPackageName">
          <el-select v-model="programConfigForm.programPackageName" placeholder="请选择" style="width: 100%" @change="handleProgramChange">
            <el-option
              v-for="item in programName"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="程序版本" prop="programPackageVersion">
          <el-select v-model="programConfigForm.programPackageVersion" placeholder="请选择" style="width: 100%" @change="handleVersionChange">
            <el-option
              v-for="item in programVersion"
              :key="item.programVersion"
              :label="item.programVersion"
              :value="item.programVersion"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="程序更新">
          <el-switch
            v-model="programConfigForm.upgradePackge"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束旧进程">
          <el-switch
            v-model="programConfigForm.upgradePackge"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="进程数量">
          <el-input-number v-model="programConfigForm.programRunCount" :min="1" :max="50" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="程序参数" prop="programArgs">
          <el-input v-model="programConfigForm.programArgs" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="启动命令" prop="programStartCommand">
          <el-input v-model="programConfigForm.programStartCommand" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="结束命令" prop="programStopCommand">
          <el-input v-model="programConfigForm.programStopCommand" />
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="执行文件" prop="programExecuteFile">
          <el-input v-model="programConfigForm.programExecuteFile" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="启用" label-width="60px" style="margin-left: 10px">
          <el-switch
            v-model="programConfigForm.programExecuteFileEnable"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="运行路径" prop="programRunPath">
          <el-input v-model="programConfigForm.programRunPath" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="程序包路径" prop="programPackgePath">
          <el-input v-model="programConfigForm.programPackgePath" />
        </el-form-item>
      </el-col>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="submitLoading" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handlerSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPackgeList, programConfigCU } from '@/api/monitor'

export default {
  name: 'ProgramConfigModal',
  props: {
    currentServerHost: {
      type: String,
      default: ''
    },
    currentServerType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      submitLoading: false,
      programConfigForm: {
        programConfName: '',
        serverHost: '',
        serverType: '',
        programPackageId: '',
        programPackageName: '',
        programPackageVersion: '',
        upgradePackge: true,
        programRunCount: 0,
        programArgs: '',
        programKillOld: true,
        programStartCommand: '',
        programStopCommand: '',
        programExecuteFile: '',
        programExecuteFileEnable: true,
        programRunPath: '',
        programPackgePath: ''
      },
      programConfigFormRules: {
        programConfName: [{ required: true }],
        programPackageName: [{ required: true }],
        programPackageVersion: [{ required: true }],
        programArgs: [{ required: true }],
        programStartCommand: [{ required: true }],
        programStopCommand: [{ required: true }],
        programExecuteFile: [{ required: true }],
        programRunPath: [{ required: true }],
        programPackgePath: [{ required: true }]
      },
      programPkgList: [],
      programName: [],
      programVersion: []
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.programConfigForm.serverHost = this.currentServerHost
      this.programConfigForm.serverType = this.currentServerType.toLocaleLowerCase().indexOf('windows') > -1 ? 'Windows' : 'Linux'
      this.initSelect()
    },
    async initSelect() {
      const res = await getPackgeList()
      if (res && res['res']) {
        this.programPkgList = res['res']
        const p_t = []
        this.programPkgList.forEach(r => {
          p_t.push(r['programName'])
        })
        this.programName = Array.from(new Set(p_t))
      }
    },
    show() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
    },
    handlerDialogClose() {
      this.$emit('close', null)
    },
    handlerSubmit() {
      this.$refs.xProgramConfigForm.validate(valid => {
        if (valid) {
          programConfigCU(this.programConfigForm).then(res => {
            console.log(res)
          })
        }
      })
    },
    handleProgramChange(data) {
      this.programVersion = this.programPkgList.filter(ppl => { return ppl['programName'] === data })
    },
    handleVersionChange(data) {
      const program = this.programPkgList.filter(ppl => {
        return ppl['programName'] === this.programConfigForm.programPackageName && ppl['programVersion'] === data
      })

      if (program.length > 0) {
        this.programConfigForm.programPackageId = program[0]['programPackageId']
      }

      console.log(this.programConfigForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.info-div {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;

  .info-span {
    width: 200px;
    text-align: center;
  }
}

.main-dialog {
  ::v-deep .el-dialog__body {
    padding: 10px;
    height: 500px;
    overflow-y: auto;
  }
}

.operation-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
