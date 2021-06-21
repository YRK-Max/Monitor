<template>
  <el-dialog
    ref="XAbnormalForm"
    title="异常录入表单"
    :visible.sync="visible"
    width="500px"
  >
    <el-form label-width="80px" label-position="left">
      <el-form-item label="异常名称">
        <el-select class="full-w" value="down">
          <el-option label="设备宕机" value="down" />
        </el-select>
      </el-form-item>
      <el-form-item label="猜测原因">
        <el-input />
      </el-form-item>
      <el-form-item label="异常时间">
        <el-date-picker class="full-w" type="datetime" />
      </el-form-item>
      <el-form-item label="设备">
        <el-select class="full-w" value="CUT1">
          <el-option label="CUT1" value="CUT1" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" rows="5" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="visible=false">取消</el-button>
      <el-button type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AbnormalInFormModal',
  data() {
    return {
      visible: false
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    close() {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
