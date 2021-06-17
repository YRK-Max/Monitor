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
            <p-m-form title="保养录入单" :form-json="formJson" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PlanCard from '@/modules/maintenance/plan/components/PlanCard'
import PMForm from '@/modules/maintenance/components/PMForm'
export default {
  name: 'MainPlanEdit',
  components: { PMForm, PlanCard },
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
      formJson: []
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
      this.formJson = [
        {
          key: '1',
          children: [
            { type: 'label', value: '姓名', span: 6 },
            { type: 'input', value: '袁荣坤', span: 6, disabled: true },
            { type: 'label', value: '部门', span: 6 },
            { type: 'input', value: '软件部', span: 6, disabled: true }
          ]
        },
        {
          key: '2',
          children: [
            { type: 'label', value: '职务', span: 6 },
            { type: 'input', value: '开发工程师', span: 6, disabled: true },
            { type: 'label', value: '录入时间', span: 6, disabled: true },
            { type: 'input', value: '2021-06-12 01:12:22', span: 6, disabled: true }
          ]
        },
        {
          key: '3',
          children: [
            { type: 'label', value: '保养时间', span: 6 },
            { type: 'input', span: 18, value: '每周 2', disabled: true }
          ]
        },
        {
          key: '4',
          children: this.formatContent(this.currentPlanInfo['content'])
        },
        {
          key: '5',
          children: [
            { type: 'label', value: '保养耗材', span: 6 },
            { type: 'input', span: 18, value: '' }
          ]
        },
        {
          key: '7',
          children: [
            { type: 'label', value: '备注', span: 6, height: 118 },
            { type: 'textarea', span: 18, height: 118, value: '' }
          ]
        }
      ]
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
    },
    formatContent(list) {
      const arrayList = [
        { type: 'label', value: '保养事项', span: 24 }
      ]
      for (const content of list) {
        arrayList.push({ type: 'label', value: content['name'], span: 6 })
        arrayList.push({ type: 'contentLabel', disabled: true, span: 15, value: content['content'] })
        arrayList.push({ type: 'checkbox', value: content['state'] || false, span: 3 })
      }
      arrayList.push({ type: 'label', value: '-- 事项结束 --', span: 24 })
      return arrayList
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
