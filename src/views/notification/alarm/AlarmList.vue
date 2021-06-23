<template>
  <div class="m-5">
    <el-card class="params-panel mb-10">
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
    <el-card class="content-panel" header="Alarm 列表">
      <el-table
        :header-cell-style="{ background: '#f0f7ff' }"
        :height="height"
        :data="alarmList"
      >
        <el-table-column type="index" width="55" label="NO." align="center" />
        <el-table-column prop="timekey" label="发生时间" sortable align="center" />
        <el-table-column prop="type" label="类型" align="center">
          <template slot-scope="scope">
            <el-tag :type="degree(scope.row['type'])" size="small">{{ scope.row['type'] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="来源" align="center" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="content" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row['state']==='set'?'danger':'normal'" size="small">{{ scope.row['state'] }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AlarmList',
  data() {
    return {
      searchForm: {
        timeRange: []
      },
      pickerOptions: {},
      alarmList: [
        { type: 'severe', timekey: '2021-06-04 14:00:00', source: '10.3.5.124:8081', content: '测试测试u成都上课纪律部队数据库表设计考虑搬家', state: 'set' },
        { type: 'mid', timekey: '2021-06-04 14:00:00', source: '10.3.5.124:8081', content: '测试测试u成都上课纪律部队数据库表设计考虑搬家', state: 'set' },
        { type: 'info', timekey: '2021-06-04 14:00:00', source: '10.3.5.124:8081', content: '测试测试u成都上课纪律部队数据库表设计考虑搬家', state: 'clear' }
      ]
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height - 240
    }
  },
  methods: {
    degree(type) {
      switch (type) {
        case 'severe': return 'danger'
        case 'mid': return 'warning'
        default: return 'info'
      }
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

  ::v-deep .el-card__body {
    padding: 12px;
  }
}

.content-panel {
  ::v-deep .el-card__header {
      padding: 15px;
    }
  ::v-deep .el-card__body {
      padding: 10px;
    }
}
</style>
