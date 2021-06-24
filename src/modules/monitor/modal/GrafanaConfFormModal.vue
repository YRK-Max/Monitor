<template>
  <el-dialog
    title="计划添加"
    :visible.sync="visible"
    :width="device==='mobile'?'90%':'40%'"
    :destroy-on-close="true"
  >
    <el-form
      ref="XPlanForm"
      :model="planForm"
      :rules="planFormRules"
      label-width="100px"
      class="plan-form-style"
    >
      <el-form-item label="计划名称" prop="name">
        <el-input v-model="planForm.name" />
      </el-form-item>
      <el-col :lg="12">
        <el-form-item label="类型" prop="type">
          <el-input v-model="planForm.type" />
        </el-form-item>
      </el-col>
      <el-col :lg="12">
        <el-form-item label="优先级" prop="priority">
          <el-input-number v-model="planForm.priority" style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-form-item label="周期" prop="cycle">
        <el-input v-model="planForm.cycle" style="width: calc(80% - 10px); margin-right: 10px;" />
      </el-form-item>
      <el-form-item label="指派" prop="assign">
        <el-input v-model="planForm.assign" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="visible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'GrafanaConfFormModal',
  data() {
    return {
      visible: false,
      planForm: {
      },
      planFormRules: {
        name: [
          { required: true, message: '必填项未填' }
        ]
      }
    }
  },
  computed: {
    device() {
      return this.$store.state.app.device
    }
  },
  methods: {
    controlVisible(visible, mode = 'add', info = null) {
      this.visible = visible
      if (mode === 'edit' && info !== null) {
        this.planForm = info
      } else {
        this.planForm = {
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-form-style {
  ::v-deep .el-form-item__label {
    text-align: center;
  }
}
</style>
