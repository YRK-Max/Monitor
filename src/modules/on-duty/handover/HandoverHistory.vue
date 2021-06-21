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
    <el-row class="content-panel" :gutter="8">
      <el-col :span="16">
        <el-card header="交接历史列表">
          <el-table
            stripe
            :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
            :height="height"
            :data="handoverList"
            :highlight-current-row="true"
            :default-sort="{prop: 'inputTime', order: 'descending'}"
          >
            <el-table-column label="NO." width="55px" type="index" />
            <el-table-column label="录入人员" prop="username" />
            <el-table-column label="录入时间" prop="inputTime" sortable />
            <el-table-column label="备注" prop="comment" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card header="交接内容">
          <div :style="{ height: height + 'px' }" class="enable-scroll no-scroll-bar">
            <ol>
              <li v-for="content in currentRecord" :key="currentRecord.indexOf(content)">{{ content }}</li>
            </ol>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HandoverHistory',
  data() {
    return {
      searchForm: {
        timeRange: []
      },
      pickerOptions: {},
      handoverList: [
        { username: '袁荣坤', inputTime: '2021-06-21 14:30:58', comment: '测试用的', contents: ['第一条记录', '第二条测试记录'] },
        { username: '袁荣坤', inputTime: '2021-06-18 14:30:58', comment: '测试用的', contents: ['第三条记录', '第四条测试记录'] }
      ],
      currentRecord: []
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height - 245
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.handoverList.length > 0) {
        this.currentRecord = this.handoverList[0]['contents']
      }
    }, 300)
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

.content-panel {
  ::v-deep .el-card {
    .el-card__header {
      padding: 15px;
    }
    .el-card__body {
      padding: 10px;
    }
  }
}
</style>
