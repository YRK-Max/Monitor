<template>
  <el-card :body-style="{background: '#f2f2f2'}" shadow="none">
    <el-row :gutter="12">
      <el-col :span="4">
        <img style="border-radius: 6px; overflow: hidden" width="100%" src="@/assets/image/index.png" alt="">
      </el-col>
      <el-col :span="20" />
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'PortInfoCard'
}
</script>

<style scoped>

</style>
