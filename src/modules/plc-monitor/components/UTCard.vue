<template>
  <el-card :body-style="{padding: '12px'}" class="main-card">
    <el-row :gutter="5">
      <el-col :span="24">
        <el-row :gutter="5">
          <el-col class="info-col mb-6" :span="24"><label class="title label-overflow-ellipsis">电压</label><label>220 V</label></el-col>
          <el-col class="info-col mb-6" :span="24"><label class="title label-overflow-ellipsis">电流</label><label>12 A</label></el-col>
          <el-col class="info-col mb-6" :span="24"><label class="title label-overflow-ellipsis">真空压力</label><label>10 pa</label></el-col>
          <el-col class="info-col mb-6" :span="24"><label class="title label-overflow-ellipsis">当前流量</label><label>784 ㎡</label></el-col>
          <el-col class="info-col" :span="24"><label class="title label-overflow-ellipsis">总流量</label><label>1204 ㎡</label></el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'UTCard'
}
</script>

<style lang="scss" scoped>
.main-div {
  label {
    font-weight: normal;
  }

  label.title {
    display: inline-block;
    width: 100px;
    margin-right: 15px;
  }

  label + label {
    vertical-align: top;
    font-size: small;
    color: #007bff;
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
