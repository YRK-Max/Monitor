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
          </div>
          <div class="plan-container">
            <el-table
              :data="currentPlanInfo['content']"
            >
              <el-table-column width="55px" type="selection" />
              <el-table-column prop="name" label="名称" width="200" />
              <el-table-column prop="content" label="工作内容" />
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PlanCard from '@/modules/maintenance/plan/components/PlanCard'
export default {
  name: 'MainPlanEdit',
  components: { PlanCard },
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
            { name: '拉线设备联调', content: '法国v方可话剧方可才能靠近你客服那里那里呢' }
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
            { name: '拉线设备联调', content: '法国v方可话剧方可才能靠近你客服那里那里呢' }
          ]
        }
      ]
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
    getInfoById(id) {
      const list = this.planList.filter(p => { return p.id === id })
      if (list.length > 0) {
        return list[0]
      }
      return { name: '', content: [] }
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
