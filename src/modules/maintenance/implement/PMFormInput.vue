<template>
  <div class="main-div m-5">
    <el-row :gutter="8">
      <el-col :lg="currentTask === null?24:10">
        <el-card header="今天任务列表">
          <div :style="{ height: height + 'px' }" class="task-container no-scroll-bar">
            <task-card
              v-for="task in taskList"
              :key="taskList.indexOf(task)"
              style="margin-bottom: 6px"
              :task-id="task.taskId"
              :task-name="task.taskName"
              :state="task.state"
              :creator="task.creator"
              :type="task.type"
              :plan="task.plan"
              :assign="task.assign"
              @click="handleTaskCardClick"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :lg="currentTask === null?0:14">
        <el-card :header="'具体工作内容 -- ' + (currentTask !== null?currentTask['taskName']:'空任务')">
          <div :style="{ height: (height-115)/3 + 'px', padding: '5px', overflow: 'scroll' }" class="no-scroll-bar">
            <el-form label-width="100px">
              <el-form-item label="工作地点">
                <el-input disabled />
              </el-form-item>
              <el-form-item label="工作内容">
                <el-input type="textarea" disabled :rows="5" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card
          style="margin-top: 10px"
          :header="'维保数据录入 -- ' + (currentTask !== null?currentTask['taskName']:'空任务')"
        >
          <div :style="{ height: (height-60)*2/3 + 'px', padding: '5px', overflow: 'scroll' }" class="no-scroll-bar">
            <div style="margin-bottom: 10px; margin-left: 10px; width: 100%;">
              <el-button type="primary">任务完结</el-button>
            </div>
            <el-form inline label-width="100px" :model="consumableForm">
              <el-row>
                <el-col :lg="10">
                  <el-form-item label="耗材名称" class="full-width">
                    <el-select v-model="consumableForm.name">
                      <el-option value="1">耗材1</el-option>
                      <el-option value="2">耗材2</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :lg="10">
                  <el-form-item label="消耗数量">
                    <el-input-number v-model="consumableForm.count" />
                  </el-form-item>
                </el-col>
                <el-col :lg="4" style="display: flex; justify-content: flex-end;">
                  <el-button>添加耗材记录</el-button>
                </el-col>
              </el-row>
              <el-col :lg="24">
                <el-form-item label="维保结果" class="full-width">
                  <el-input />
                </el-form-item>
              </el-col>
              <el-col :lg="24">
                <el-form-item label="维保备注" class="full-width">
                  <el-input type="textarea" :rows="3" />
                </el-form-item>
              </el-col>
            </el-form>
            <el-table border>
              <el-table-column prop="name" label="耗材名称" />
              <el-table-column prop="数量" label="消耗数量" />
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TaskCard from '@/modules/maintenance/implement/components/TaskCard'
export default {
  name: 'PMFormInput',
  components: { TaskCard },
  data() {
    return {
      taskList: [
        {
          taskId: '100001',
          taskName: '机油补充',
          state: 'notFinish', priority: '一般',
          creator: 'admin', type: '周期任务', plan: '清洗机维保计划',
          assign: ['袁荣坤', '杨志']
        },
        {
          taskId: '100002', taskName: '轴承检查',
          state: 'notFinish', priority: '一般',
          creator: 'admin', type: '周期任务',
          plan: '清洗机维保计划', assign: ['袁荣坤', '杨志']
        },
        {
          taskId: '100003', taskName: '内部清洁',
          state: 'finish', priority: '一般',
          creator: 'admin', type: '周期任务',
          plan: '清洗机维保计划', assign: ['袁荣坤', '杨志'] },
        {
          taskId: '200001', taskName: '内部清洁',
          state: 'finish', priority: '一般',
          creator: 'admin', type: '周期任务',
          plan: '拉线设备联调', assign: ['袁荣坤']
        }
      ],
      consumableForm: {
        name: '',
        count: 0
      },
      currentTask: null
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height - 165
    }
  },
  methods: {
    handleTaskCardClick(data) {
      this.currentTask = this.taskList.filter(task => { return task.taskId === data })[0]
    }
  }
}
</script>

<style lang="scss" scoped>
.main-div {
  ::v-deep .el-form-item__label {
    font-weight: normal;
    text-align: center;
  }
  ::v-deep .el-form-item__content {
    width: calc(100% - 100px);
  }
  ::v-deep {
    .el-card__body {
      padding: 5px;
    }
  }
}
.task-container {
  overflow-y: scroll;
}

.full-width {
  width: 100%;
}
</style>
