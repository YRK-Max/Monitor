<template>
  <el-row class="main-row">
    <el-col :span="24">
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
    </el-col>
    <el-col :span="24">
      <el-card
        header="日志信息列表"
      >
        <el-table
          :data="logList"
          :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
        >
          <el-table-column
            prop="createTime"
            label="发生时间"
          />
          <el-table-column
            prop="event"
            label="操作事件"
          />
          <el-table-column
            prop="eventUser"
            label="操作者"
          />
          <el-table-column
            prop="sourceIP"
            label="操作来源IP"
          />
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          style="float: right; margin: 5px"
          :total="0"
        />
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'LogViewer',
  data() {
    return {
      logList: [],
      searchForm: {
        timeRange: []
      },
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
      }
    }
  },
  methods: {
    handleSearch() {
      console.log(this.searchForm.timeRange)
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

.main-row {
  margin: 5px;
}
</style>
