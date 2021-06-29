<template>
  <div class="main-div m-5">
    <el-row :gutter="5">
      <el-col :lg="10">
        <el-card
          header="设备列表"
          :body-style="{padding: '6px'}"
        >
          <div :style="{height: height/2 + 'px'}" class="enable-y-scroll no-scroll-bar">
            <mac-card class="mac-card mb-6" />
            <mac-card class="mac-card" />
          </div>
        </el-card>
        <el-card
          header="WIP列表"
          :body-style="{padding: '6px'}"
        >
          <div class="enable-y-scroll no-scroll-bar">
            <el-table
              :height="(height/2 - 70)"
            >
              <el-table-column type="index" width="55px" label="NO." />
              <el-table-column label="GLASS" />
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="14" style="min-width: 600px">
        <el-card
          header="实时数据"
          :body-style="{padding: '6px'}"
        >
          <div :style="{height: height + 'px'}" class="enable-y-scroll no-scroll-bar">
            <el-row :gutter="5" class="mb-10">
              <el-col :span="6">
                <safe-signal-card class="mb-10" />
                <UTCard />
              </el-col>
              <el-col :span="18">
                <el-card>
                  <el-table
                    :height="303"
                  >
                    <el-table-column label="alarmCode" />
                  </el-table>
                </el-card>
              </el-col>
            </el-row>
            <robot-info-card class="mb-10" />
            <port-info-card />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MacCard from '@/modules/plc-monitor/components/MacCard'
import RobotInfoCard from '@/modules/plc-monitor/components/RobotInfoCard'
import PortInfoCard from '@/modules/plc-monitor/components/PortInfoCard'
import SafeSignalCard from '@/modules/plc-monitor/components/SafeSignalCard'
import UTCard from '@/modules/plc-monitor/components/UTCard'
export default {
  name: 'MacMonitor',
  components: { UTCard, SafeSignalCard, PortInfoCard, RobotInfoCard, MacCard },
  computed: {
    height() {
      return this.$store.getters.body_height - 170
    }
  }
}
</script>

<style lang="scss" scoped>
.mac-card {

}

.mac-card:hover{
  cursor: pointer;
}
</style>
