<template>
  <el-card :body-style="{padding: '12px'}" class="main-card" shadow="hover">
    <el-row :gutter="5">
      <el-col :span="24">
        <el-row :gutter="5">
          <el-col class="mb-6" :span="12"><label class="title label-overflow-ellipsis">设备ID</label><label>INX21204514</label></el-col>
          <el-col class="info-col mb-6" :span="12"><label class="title label-overflow-ellipsis">设备状态</label><el-tag size="mini">RUN</el-tag></el-col>
          <el-col class="info-col mb-6" :span="12"><label class="title label-overflow-ellipsis">PLC版本</label><label>v2021-06</label></el-col>
          <el-col class="info-col mb-6" :span="12"><label class="title label-overflow-ellipsis">CIM状态</label><el-tag size="mini">ONLINE</el-tag></el-col>
          <el-col :span="12"><label class="title label-overflow-ellipsis">登录人员</label><label>admin</label></el-col>
          <el-col :span="12"><label class="title label-overflow-ellipsis">VCR</label><el-switch style="vertical-align: top" disabled /></el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'MacCard'
}
</script>

<style lang="scss" scoped>
.main-div {
  label {
    font-weight: normal;
  }

  label.title {
    display: inline-block;
    width: 70px;
    margin-right: 15px;
  }

  label + label {
    vertical-align: top;
  }

  ::v-deep .el-col-12 {
    margin-bottom: 10px;
  }
}

.info-col {
  line-height: 24px;

  ::v-deep .el-tag {
    vertical-align: top;
  }
}
</style>
