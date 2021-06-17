<template>
  <div class="main-div">
    <el-row :gutter="8">
      <el-col :lg="currentPlanInfo===null?24:12" :sm="24">
        <el-card :body-style="{ height: height-160 + 'px', padding: '10px' }">
          <div slot="header" class="clearfix">
            <span>保养计划列表</span>
            <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-plus">添加计划</el-button>
          </div>
          <div class="plan-container">
            <plan-card
              v-for="plan in planList"
              :key="planList.indexOf(plan)"
              :plan-id="plan.id"
              :name="plan.name"
              :state="plan.state"
              :creator="plan.creator"
              :type="plan.type"
              :priority="plan.priority"
              :cycle="plan.cycle"
              :schedule="plan.schedule"
              :assign="plan.assign"
              style="margin-bottom: 8px"
              @click="handlePlanCardClick"
            />
          </div>
        </el-card>
      </el-col>
      <el-col v-if="currentPlanInfo !== null" :lg="12" :sm="24">
        <el-card
          :body-style="{ height: height-157 + 'px', padding: '10px' }"
        >
          <div slot="header" class="clearfix">
            <span>{{ '详细计划内容 -- '+currentPlanInfo['name'] }}</span>
            <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-circle-plus-outline">添加内容</el-button>
            <el-button style="float: right; padding: 3px 0; margin-right: 10px" type="text" icon="el-icon-delete">删除</el-button>
            <el-button style="float: right; padding: 3px 0; margin-right: 10px" type="text" icon="el-icon-view" @click="handleHidden">隐藏</el-button>
            <el-button style="float: right; padding: 3px 0; margin-right: 10px" type="text" icon="el-icon-printer" @click="handleMakeForm">生成表单</el-button>
          </div>
          <div class="plan-container">
            <el-table :data="currentPlanInfo['content']">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="name" label="任务名称" />
              <el-table-column prop="content" label="任务内容" />
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <PMInputFormModal :visible="PMInputFormModalVisible" :current-plan-info="currentPlanInfo" @close="handlePMInputFormModalClose" />
  </div>
</template>

<script>
import PlanCard from '@/modules/maintenance/plan/components/PlanCard'
import PMInputFormModal from '@/modules/maintenance/plan/modal/PMInputFormModal'
export default {
  name: 'MainPlanEdit',
  components: { PMInputFormModal, PlanCard },
  data() {
    return {
      currentPlanInfo: null,
      planList: [
        {
          id: 'kv51sd6vsd16516516v',
          name: '清洗机维保计划',
          state: '运行中',
          creator: 'admin',
          type: '周期性计划',
          priority: '一般',
          cycle: '* * 5 * * ? *',
          schedule: 65,
          assign: ['袁荣坤', '杨志'],
          content: [
            { name: '机油补充', content: '' },
            { name: '轴承检查', content: '检查1，3点位轴承状况' },
            { name: '内部清洁', content: '清除碎片和灰尘' }
          ]
        },
        {
          id: 'kv51sd6vsd1kth6516v',
          name: '1 拉设备维保计划',
          state: '等待中',
          creator: 'admin',
          type: '周期性计划',
          priority: '一般',
          cycle: '* * 5 * * ? *',
          schedule: 100,
          assign: ['袁荣坤'],
          content: [
            { name: '拉线设备联调', content: '清除碎片hhhhhh和灰尘' }
          ]
        },
        {
          id: 'kv51sd6vsd7uis6516v',
          name: '2 拉设备维保计划',
          state: '等待中',
          creator: 'admin',
          type: '周期性计划',
          priority: '一般',
          cycle: '* * 5 * * ? *',
          schedule: 75,
          assign: ['李朝阳'],
          content: [
            { name: '拉线联调', content: '法国客服那里那里呢' }
          ]
        }
      ],
      PMInputFormModalVisible: false
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height
    }
  },
  methods: {
    handlePlanCardClick(id) {
      this.currentPlanInfo = this.getInfoById(id)
    },
    handleHidden() {
      this.currentPlanInfo = null
    },
    handleMakeForm() {
      this.PMInputFormModalVisible = true
    },
    getInfoById(id) {
      const list = this.planList.filter(p => { return p.id === id })
      if (list.length > 0) {
        return list[0]
      }
      return { name: '', content: [] }
    },
    handlePMInputFormModalClose(data) {
      this.PMInputFormModalVisible = data
    }
  }
}
</script>

<style lang="scss" scoped>
.main-div {
  margin: 6px;

  ::v-deep .el-card__header {
    padding: 15px;
  }
}
.plan-container {
  width: 100%;
  height: 100%;
}
.plan-container::-webkit-scrollbar { width: 0 !important }
.plan-container { -ms-overflow-style: none; }
.plan-container { overflow: -moz-scrollbars-none; }
</style>
