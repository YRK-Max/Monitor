<template>
  <el-card
    shadow="hover"
    :body-style="{ padding: '12px' }"
    :class="state==='finish'?'finish-state':'not-finish-state'"
  >
    <div @click="handlerClick">
      <el-row type="flex">
        <el-col :span="24">
          <el-row class="info-row">
            <el-col class="mb-15" :lg="8" :sm="12">
              <label class="title-label">任务名称</label>
              <label>{{ taskName }}</label>
            </el-col>
            <el-col class="mb-15" :lg="8" :sm="12">
              <label class="title-label">完成状态</label>
              <el-tag :type="state==='finish'?'success':'danger'" size="small">{{ state }}</el-tag>
            </el-col>
            <el-col class="mb-15" :lg="8" :sm="12">
              <label class="title-label">优先级</label>
              <el-tag type="info" size="small">{{ priority }}</el-tag>
            </el-col>
            <el-col class="mb-15" :lg="8" :sm="12">
              <label class="title-label">创建者</label>
              <label>{{ creator }}</label>
            </el-col>
            <el-col class="mb-15" :lg="8" :sm="12">
              <label class="title-label">类型</label>
              <label>{{ type }}</label>
            </el-col>
            <el-col class="mb-15" :lg="8" :sm="12">
              <label class="title-label">所属计划</label>
              <label>{{ plan }}</label>
            </el-col>
            <el-col :lg="16">
              <label class="title-label">指派给</label>
              <el-tag type="info" size="small">{{ assign.join(', ') }}</el-tag>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'TaskCard',
  props: {
    taskId: {
      type: String,
      default: 'null'
    },
    taskName: {
      type: String,
      default: 'null'
    },
    state: {
      type: String,
      default: 'notFinish'
    },
    creator: {
      type: String,
      default: 'null'
    },
    type: {
      type: String,
      default: '任务'
    },
    priority: {
      type: String,
      default: '一般'
    },
    plan: {
      type: String,
      default: 'null'
    },
    assign: {
      type: Array,
      default: () => { return [] }
    }
  },
  methods: {
    handlerClick() {
      this.$emit('click', this.taskId)
    },
    handlePlanSetting(e) {
      e.stopPropagation()
      this.$emit('setting', this.taskId)
    }
  }
}
</script>

<style lang="scss" scoped>
.operation-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.info-row {
  label {
    display: inline-block;
    line-height: 24px;
    font-weight: normal;
    overflow: hidden;
    white-space: nowrap;
    width: calc(100% - 90px);
    text-overflow: ellipsis;
  }

  span {
    vertical-align: top;
  }

  .title-label{
    font-size: 15px;
    width: 80px;
  }

  ::v-deep .el-col {
    height: 24px;
  }
}
.mb-15 {
  margin-bottom: 15px;
}
.not-finish-state {
  background: #ffe9e9;
}
.finish-state {
  background: #e9ffe9;
}
</style>
