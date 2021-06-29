<template>
  <el-card :body-style="{background: '#f2f2f2'}" shadow="none" class="main-card">
    <el-row :gutter="12">
      <el-col :span="4">
        <img style="border-radius: 6px; overflow: hidden" width="100%" src="@/assets/image/robot.png" alt="">
      </el-col>
      <el-col :span="20">
        <el-row class="main-row mt-10">
          <el-col class="mb-10" :span="6">
            <label class="title label-overflow-ellipsis">Position</label><label>12</label>
          </el-col>
          <el-col class="mb-10" :span="6">
            <label class="title label-overflow-ellipsis">Speed</label><label>8</label>
          </el-col>
          <el-col class="mb-10" :span="6">
            <label class="title label-overflow-ellipsis">State</label><label>RUN</label>
          </el-col>
          <el-col class="mb-10" :span="6">
            <label class="title label-overflow-ellipsis">手臂载荷</label><label>12</label>
          </el-col>
          <el-col :span="6">
            <label class="title label-overflow-ellipsis">真空Sensor状态</label><label>12</label>
          </el-col>
          <el-col :span="6">
            <label class="title label-overflow-ellipsis">气缸Sensor状态</label><label>12</label>
          </el-col>
          <el-col :span="6">
            <label class="title label-overflow-ellipsis">Mapping Sensor状态</label><label>12</label>
          </el-col>
          <el-col :span="6">
            <label class="title label-overflow-ellipsis">产品数量</label><label>12</label>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'RobotInfoCard'
}
</script>

<style lang="scss" scoped>
.main-card {
  label {
    font-weight: normal;
  }

  label.title {
    display: inline-block;
    width: 80px;
  }

  label+label {
    margin-left: 15px;
    color: #007bff;
    font-size: 14px;
    vertical-align: top;
  }
}
</style>
