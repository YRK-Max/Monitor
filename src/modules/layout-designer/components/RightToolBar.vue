<template>
  <el-tabs active-name="1" type="border-card" class="components-layout-right enable-y-scroll no-scroll-bar">
    <el-tab-pane name="1" label="外观">
      <el-form label-width="80px" label-position="left">
        <el-form-item label="id">
          <el-input v-model="svgInfo.id" placeholder="请输入组件id" />
        </el-form-item>
        <el-form-item label="类型">
          <label>{{ svgInfo.typeName ? svgInfo.typeName : '( 空 )' }}</label>
        </el-form-item>
        <el-form-item label="名称">
          <!--eslint-disable-next-line-->
          <el-input v-model:value="svgInfo.title" placeholder="请输入组件名称"/>
        </el-form-item>
        <el-form-item label="X轴坐标">
          <el-slider v-model="svgInfo.svgPositionX" :min="0" :max="1920" />
        </el-form-item>
        <el-form-item label="Y轴坐标">
          <el-slider v-model="svgInfo.svgPositionY" :min="0" :max="1080" />
        </el-form-item>
        <el-form-item label="颜色">
          <input v-model="svgInfo.svgColor" type="color">
        </el-form-item>
        <el-form-item label="大小">
          <el-slider v-model="svgInfo.height" :min="1" :max="1500" />
        </el-form-item>
        <el-form-item label="描边宽度">
          <el-slider v-model="svgInfo.width" :min="1" :max="15" />
        </el-form-item>
        <el-form-item label="旋转">
          <el-slider v-model="svgInfo.angle" :min="0" :max="360" />
        </el-form-item>
        <el-button type="primary" class="btn-sure">
          确定
        </el-button>
      </el-form>
    </el-tab-pane>
    <el-tab-pane name="2" label="数据">
      <div class="bg-code">{{ svgInfo }}</div>
    </el-tab-pane>
  </el-tabs>

</template>
<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: {
    svgInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    handlerAddClass() {
      document.getElementById(this.svgInfo.id).classList.add(this.svgInfo.class)
      this.$message.success('修改成功')
    }
  }
}
</script>
<style scoped lang="scss">
.components-layout-right {
  width: 100%;
  height: 100%;

  ::v-deep .el-form-item {
    margin-bottom: 10px;
  }
}

.btn-sure {
  width: 100%;
}

.bg-code {
  background: #444;
  color: #fff;
  width: calc(100% - 20px);
  margin: 20px 10px;
  border-radius: 4px;
  padding: 10px;
}
</style>
