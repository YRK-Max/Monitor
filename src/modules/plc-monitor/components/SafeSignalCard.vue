<template>
  <el-card :body-style="{padding: '12px'}" class="main-card">
    <el-row :gutter="5">
      <el-col :span="24">
        <el-row :gutter="5">
          <el-col class="info-col mb-6" :span="24"><label class="title label-overflow-ellipsis">DOOR</label><el-tag size="mini">一切正常</el-tag></el-col>
          <el-col class="info-col mb-6" :span="24"><label class="title label-overflow-ellipsis">OEM</label><el-tag size="mini">一切正常</el-tag></el-col>
          <el-col class="info-col" :span="24"><label class="title label-overflow-ellipsis">INTER LOCK</label><el-tag size="mini">一切正常</el-tag></el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'SafeSignalCard'
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
