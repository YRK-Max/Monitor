<template>
  <el-card
    shadow="hover"
    :body-style="{ padding: '12px' }"
  >
    <div @click="handlerClick">
      <el-row type="flex">
        <el-col :span="21">
          <el-row class="info-row">
            <el-col class="mb-15" :lg="8" :sm="12">
              <label class="title-label">名称</label>
              <label>{{ name }}</label>
            </el-col>
            <el-col class="mb-15" :lg="8" :sm="12">
              <label class="title-label">状态</label>
              <el-tag type="success" size="small">{{ state }}</el-tag>
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
              <label class="title-label">优先级</label>
              <el-tag type="info" size="small">{{ priority }}</el-tag>
            </el-col>
            <el-col class="mb-15" :lg="8" :sm="12">
              <label class="title-label">执行周期</label>
              <label>{{ cycle }}</label>
            </el-col>
            <el-col class="mb-15" :lg="8" :sm="12">
              <div style="width: 100%; height: 100%; display: flex; align-items: center">
                <label class="title-label">下次执行时间</label>
                <label>{{ getLastTime(cycle) }}</label>
              </div>
            </el-col>
            <el-col :lg="16">
              <label class="title-label">指派给</label>
              <el-tag type="info" size="small">{{ assign.join(', ') }}</el-tag>
            </el-col>
          </el-row>
        </el-col>
        <el-col class="operation-content" :span="3">
          <el-button icon="el-icon-setting" type="primary" circle @click="handlePlanSetting" />
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { parseTime } from '@/utils'

export default {
  name: 'PlanEditCard',
  props: {
    planId: {
      type: String,
      default: 'null'
    },
    name: {
      type: String,
      default: 'null'
    },
    state: {
      type: String,
      default: '停止'
    },
    creator: {
      type: String,
      default: 'null'
    },
    type: {
      type: String,
      default: '一次性任务'
    },
    priority: {
      type: String,
      default: '一般'
    },
    cycle: {
      type: String,
      default: 'null'
    },
    schedule: {
      type: Number,
      default: 0
    },
    assign: {
      type: Array,
      default: () => { return [] }
    }
  },
  methods: {
    handlerClick() {
      this.$emit('click', this.planId)
    },
    handlePlanSetting(e) {
      e.stopPropagation()
      this.$emit('setting', this.planId)
    },
    getLastTime(cron) {
      const parser = require('cron-parser')
      const interval = parser.parseExpression(cron)
      return parseTime(interval.next(), undefined)
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
</style>
