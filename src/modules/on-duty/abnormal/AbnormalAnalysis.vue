<template>
  <div class="m-5 main-div">
    <el-card class="params-panel">
      <el-form inline label-position="left">
        <el-form-item label="查询时间段选择" label-width="120px">
          <el-date-picker
            v-model="searchForm.timeRange"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="left"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-row :gutter="8">
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>异常趋势</span>
            <el-radio-group v-model="SwitchTimeUnit" style="float: right" size="mini">
              <el-radio-button label="时" />
              <el-radio-button label="日" />
              <el-radio-button label="月" />
            </el-radio-group>
          </div>
          <line-chart style="height: 450px" :series-data="UpSeriesData" :x-axis="xUpData" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>机种异常趋势</span>
            <el-radio-group v-model="SwitchTimeUnit" style="float: right" size="mini">
              <el-radio-button label="时" />
              <el-radio-button label="日" />
              <el-radio-button label="月" />
            </el-radio-group>
          </div>
          <line-chart style="height: 450px" :series-data="DLSeriesData" :x-axis="xDLData" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="异常类别占比">
          <pie-chart style="height: 450px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from '@/components/Charts/LineChart'
import PieChart from '@/components/Charts/PieChart'
export default {
  name: 'AbnormalAnalysis',
  components: { LineChart, PieChart },
  data() {
    return {
      searchForm: {
        timeRange: []
      },
      UpSeriesData: [
        { name: '异常趋势', data: [13, 10, 3, 12, 15, 30, 7] }
      ],
      xUpData: ['2021-06-11', '2021-06-12', '2021-06-13', '2021-06-14'],
      DLSeriesData: [
        { name: '机种1', data: [13, 10, 3, 12, 15, 30, 7] },
        { name: '机种2', data: [19, 14, 13, 32, 25, 35, 17] },
        { name: '机种3', data: [10, 24, 30, 25, 15, 34, 27] }
      ],
      xDLData: ['2021-06-11', '2021-06-12', '2021-06-13', '2021-06-14'],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      SwitchTimeUnit: '时'
    }
  },
  methods: {
    handleSearch() {

    }
  }
}
</script>

<style lang="scss" scoped>
.params-panel {
  background: #f7faff;
  height: 65px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  align-content: center;
  border: 1px solid #9cc4ff;
  ::v-deep .el-card__body{
    padding: 12px;
  }
}

.main-div {
  ::v-deep .el-card{
    .el-card__header {
      padding: 11px;
      line-height: 28px;
    }
  }
  ::v-deep .el-col{
    margin-bottom: 8px;
  }
}
</style>
