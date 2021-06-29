<template>
  <el-dialog
    title="操作"
    :visible.sync="dialogVisible"
    width="320px"
  >
    <div class="info-container">
      <div class="info-div">
        <label>JOB</label><span class="info-span">{{ currentService.job }}</span>
      </div>
      <div class="info-div">
        <label>Status</label>
        <div style="display: flex; align-content: center; justify-content: center; width: 200px">
          <i :class="['yicon-common', 'yiconB', currentService['health']]" />
          <el-tag :type="currentService['health'] === 'up'?'success':'danger'" size="small">{{
            currentService['health']
          }}
          </el-tag>
        </div>
      </div>
      <div class="info-div">
        <label>Instance</label><span class="info-span">{{ currentService.instance }}</span>
      </div>
    </div>
    <div class="operation-container">
      <el-popconfirm
        title="确定停止服务吗？"
      >
        <el-button slot="reference" :disabled="currentService['health'] === 'down'" type="danger">停止</el-button>
      </el-popconfirm>
      <el-button :disabled="currentService['health'] === 'up'" type="success">启动</el-button>
      <el-button type="primary">重启</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ProcessControlModal',
  data() {
    return {
      dialogVisible: false,
      currentService: {
        job: '',
        health: 'up',
        instance: ''
      }
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
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
</style>
