<template>
  <div class="main-div m-5">
    <el-row :gutter="6">
      <el-col :lg="12">
        <el-card header="异常列表">
          <div :style="{ height: height + 'px' }" class="content-body enable-scroll no-scroll-bar">
            <el-button type="primary">异常录入</el-button>
            <el-table
              style="margin-top: 10px"
              stripe
              :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
            >
              <el-table-column
                prop="name"
                label="异常名称"
              />
              <el-table-column
                prop="guess_reason"
                label="猜测原因"
              />
              <el-table-column
                prop="commit_user"
                label="提交者"
              />
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="12">
        <el-card header="处理进度展示">
          <div :style="{ height: height + 'px' }" class="content-body enable-scroll no-scroll-bar">
            <div style="display: flex; justify-content: center; align-items: center;" class="full-w mt-10">
              <el-steps class="full-w" :active="2" finish-status="success" align-center>
                <el-step title="技术部受理" />
                <el-step title="异常处理中" />
                <el-step title="处理结果确认" />
                <el-step title="移除排除" />
              </el-steps>
            </div>
            <el-divider />
            <el-timeline style="margin-right: 25px">
              <el-timeline-item timestamp="2018/4/12" placement="top">
                <el-card>
                  <h4>原因查找完毕</h4>
                  <label class="comment">处理意见：<span>由于碎片未及时处理导致卡片</span></label>
                  <p>王小虎 提交于 2018/4/12 20:46</p>
                </el-card>
              </el-timeline-item>
              <el-timeline-item timestamp="2018/4/12" placement="top">
                <el-card>
                  <h4>技术部开始维修</h4>
                  <p>王小虎 提交于 2018/4/12 18:46</p>
                </el-card>
              </el-timeline-item>
              <el-timeline-item timestamp="2018/4/12" placement="top">
                <el-card>
                  <h4>技术部受理</h4>
                  <p>王小虎 提交于 2018/4/12 14:46</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'CaseCloseManage',
  computed: {
    height() {
      return this.$store.getters.body_height - 170
    }
  }
}
</script>

<style lang="scss" scoped>
.main-div {
  ::v-deep .el-card {
    .el-card__body {
      padding: 8px;
    }
    .el-card__header {
      padding: 15px;
      color: #e3e3e3;
      background: linear-gradient(to left, #656686, #343441);
    }
  }
}

.comment {
  font-weight: normal;
}
</style>
