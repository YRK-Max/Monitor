<template>
  <el-dialog
    title="计划添加"
    :visible.sync="visible"
    :width="device==='mobile'?'90%':'40%'"
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
        <el-button style="width: 20%" @click="handleCronEdit">编辑</el-button>
      </el-form-item>
      <el-form-item label="指派" prop="assign">
        <el-input v-model="planForm.assign" />
      </el-form-item>
    </el-form>
    <el-dialog title="生成 cron" :visible.sync="showCron" append-to-body :width="device==='mobile'?'90%':'30%'" top="5vh">
      <vcrontab
        class="dialog-cron"
        :expression="planForm.cycle"
        @hide="showCron=false"
        @fill="handleCronFill"
      />
    </el-dialog>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="visible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import vcrontab from 'vcrontab'
export default {
  name: 'PlanFormModal',
  components: {
    vcrontab
  },
  data() {
    return {
      visible: true,
      planForm: {
        name: '',
        creator: this.$store.getters.name,
        type: '',
        priority: 0,
        cycle: '0 0 0 1 * ?',
        assign: []
      },
      planFormRules: {
        name: [
          { required: true, message: '必填项未填' }
        ]
      },
      showCron: false
    }
  },
  computed: {
    device() {
      return this.$store.state.app.device
    }
  },
  methods: {
    controlVisible(visible) {
      this.visible = visible
    },
    handleCronEdit() {
      this.showCron = true
    },
    handleCronFill(data) {
      this.planForm.cycle = data
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

.dialog-cron {
  height: 75vh;
  overflow-y: scroll;
}
.dialog-cron::-webkit-scrollbar { width: 0 !important }
</style>
