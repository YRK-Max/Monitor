<template>
  <div class="main-div m-5">
    <el-row :gutter="6">
      <el-col :lg="14">
        <el-card header="异常列表">
          <div :style="{ height: height + 'px' }" class="content-body enable-scroll no-scroll-bar">
            <el-button type="primary" @click="handleAbnormalIn">异常录入</el-button>
            <el-table
              style="margin-top: 10px"
              stripe
              :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
              :data="abnormalList"
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
                prop="abnormal_time"
                label="异常时间"
              />
              <el-table-column
                prop="machine"
                label="设备"
              />
              <el-table-column
                prop="schedule"
                label="处理进度"
                align="center"
              >
                <template slot-scope="scope">
                  <el-progress :percentage="(scope.row.schedule/4) * 100" />
                </template>
              </el-table-column>
              <el-table-column
                prop="operate"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="处理结果确认" placement="bottom">
                    <el-button :disabled="scope.row.schedule < 2" :type="scope.row.schedule<2?'info':'primary'" size="small" circle icon="el-icon-document-checked" />
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="结案" placement="bottom">
                    <el-button :disabled="scope.row.schedule < 3" :type="scope.row.schedule<3?'info':'primary'" size="small" circle icon="el-icon-check" />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="10">
        <el-card header="处理进度展示">
          <div :style="{ height: height + 'px' }" class="content-body enable-scroll no-scroll-bar">
            <div style="display: flex; justify-content: center; align-items: center;" class="full-w mt-10">
              <el-steps class="full-w" :active="2" finish-status="success" align-center>
                <el-step title="技术部受理" />
                <el-step title="异常处理中" />
                <el-step title="处理结果确认" />
                <el-step title="异常排除" />
              </el-steps>
            </div>
            <el-divider />
            <el-timeline style="margin-right: 25px">
              <el-timeline-item timestamp="2018/4/12" placement="top">
                <el-card>
                  <h4>原因查找完毕</h4>
                  <label class="comment">处理意见：<span>由于碎片未及时处理导致卡片</span></label>
                  <p>袁荣坤 提交于 2018/4/12 20:46</p>
                </el-card>
              </el-timeline-item>
              <el-timeline-item timestamp="2018/4/12" placement="top">
                <el-card>
                  <h4>技术部开始维修</h4>
                  <p>袁荣坤 提交于 2018/4/12 18:46</p>
                </el-card>
              </el-timeline-item>
              <el-timeline-item timestamp="2018/4/12" placement="top">
                <el-card>
                  <h4>技术部受理</h4>
                  <p>袁荣坤 提交于 2018/4/12 14:46</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <AbnormalInFormModal ref="CCMXAFM" />
  </div>
</template>

<script>
import AbnormalInFormModal from '@/modules/on-duty/abnormal/modal/AbnormalInFormModal'
export default {
  name: 'CaseCloseManage',
  components: { AbnormalInFormModal },
  data() {
    return {
      abnormalList: [
        { name: '设备宕机', guess_reason: '碎片未清理', abnormal_time: '2021-06-12 12:00:14', machine: 'CUT1', schedule: '2' },
        { name: '设备宕机', guess_reason: '未知', abnormal_time: '2021-06-08 14:25:14', machine: 'BEN2', schedule: '1' }
      ]
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height - 170
    }
  },
  methods: {
    handleAbnormalIn() {
      this.$refs.CCMXAFM.show()
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
      //color: #e3e3e3;
      //background: linear-gradient(to left, #304156, #2b2f3a);
    }
  }
}

.comment {
  font-weight: normal;
}
</style>
