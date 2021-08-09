<template>
  <el-dialog
    title="看板维护"
    :visible.sync="visible"
    :width="device==='mobile'?'90%':'40%'"
    :destroy-on-close="true"
  >
    <el-form
      ref="XPlanForm"
      :model="dashboardConfForm"
      :rules="dashboardConfFormRules"
      label-width="100px"
      class="plan-form-style"
    >
      <el-form-item label="Group" prop="group">
        <el-input v-model="dashboardConfForm.group" />
      </el-form-item>
      <el-form-item label="Name" prop="name">
        <el-input v-model="dashboardConfForm.name" />
      </el-form-item>
      <el-form-item label="Job" prop="job">
        <el-input v-model="dashboardConfForm.job" />
      </el-form-item>
      <el-form-item label="Targets" prop="targets">
        <el-input v-model="dashboardConfForm.targets" />
      </el-form-item>
      <el-form-item label="Uid" prop="uid">
        <el-input v-model="dashboardConfForm.uid" />
      </el-form-item>
      <el-form-item label="Url" prop="url">
        <el-input v-model="dashboardConfForm.url" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { editGrafanaDashboardConf } from '@/api/monitor'

export default {
  name: 'GrafanaConfFormModal',
  data() {
    return {
      visible: false,
      dashboardConfForm: {
        group: '',
        name: '',
        job: '',
        targets: '',
        uid: '',
        url: ''
      },
      dashboardConfFormRules: {
        name: [
          { required: true, message: '必填项未填' }
        ],
        group: [
          { required: true, message: '必填项未填' }
        ],
        job: [
          { required: true, message: '必填项未填' }
        ],
        targets: [
          { required: true, message: '必填项未填' }
        ],
        uid: [
          { required: true, message: '必填项未填' }
        ],
        url: [
          { required: true, message: '必填项未填' }
        ]
      },
      loading: false
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
        this.dashboardConfForm = info
      } else {
        this.dashboardConfForm = {
          group: '',
          name: '',
          job: '',
          targets: '',
          uid: '',
          url: ''
        }
      }
    },
    handleSubmit() {
      this.loading = true
      editGrafanaDashboardConf([this.dashboardConfForm]).then(res => {
        if (res) {
          this.$message.success('操作成功')
          this.visible = false
          this.loading = false
        }
      })
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
