<template>
  <el-dialog
    title="操作"
    :visible.sync="dialogVisible"
    width="320px"
    class="main-dialog"
    @close="handlerDialogClose"
  >
    <div class="info-container">
      <div class="info-div">
        <label>server Host</label><span class="info-span">{{ currentServerHost || '--' }}</span>
      </div>
      <div class="info-div">
        <label>程序名称</label><span class="info-span">{{ currentService['processName'] || '--' }}</span>
      </div>
      <div class="info-div">
        <label>运行状态</label>
        <div style="display: flex; align-content: center; justify-content: center; width: 200px">
          <i :class="['yicon-common', 'yiconB', currentService['processRunStatus']]" />
          <el-tag :type="currentService['processRunStatus'] === 'RUN'?'success':'danger'" size="small">{{ currentService['processRunStatus'] }}</el-tag>
        </div>
      </div>
      <div class="info-div">
        <label>程序描述</label><span class="info-span">{{ currentService['programDesc'] }}</span>
      </div>
      <div class="info-div">
        <label>进程编号</label><span class="info-span">{{ currentService['processId'] }}</span>
      </div>
    </div>
    <div class="operation-container">
      <el-popconfirm
        title="确定停止服务吗？"
        @onConfirm="handlerStopProcess"
      >
        <el-button slot="reference" :loading="stopLoading" :disabled="currentService['processRunStatus'] !== 'RUN'" type="danger">停止</el-button>
      </el-popconfirm>
      <el-button :loading="startLoading" :disabled="currentService['processRunStatus'] === 'RUN'" type="success">启动</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { stopProcess } from '@/api/monitor'

export default {
  name: 'ProcessControlModal',
  props: {
    currentService: {
      type: Object,
      default: () => { return {} }
    },
    currentServerHost: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      stopLoading: false,
      startLoading: false
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
    },
    handlerStopProcess() {
      this.stopLoading = true
      stopProcess({ serverHost: this.currentServerHost, processName: this.currentService['processName'], processId: this.currentService['processId'] }).then(res => {
        if (res && res['mesg'] === 'OK') {
          this.$message.success('进程已结束')
        } else {
          this.$message.error('进程未正确关闭')
        }
        this.stopLoading = false
      })
    },
    handlerDialogClose() {
      this.$emit('close', null)
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
  }
}

.operation-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
</style>
