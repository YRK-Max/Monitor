<template>
  <div>
    <div style="width: 100%; text-align: right">
      <el-button v-print="'#formModalArea'" type="primary" plain circle icon="el-icon-printer" />
    </div>
    <div id="formModalArea" class="main-div">
      <div style="text-align: center; margin-bottom: 15px;">
        <h2 style="font-weight: bolder">{{ title }}</h2>
      </div>
      <el-form>
        <el-row v-for="row in formJson" :key="row.key">
          <el-col
            v-for="col in row.children"
            :key="row.key + row.children.indexOf(col)"
            :span="col.span"
            :style="{height: (col.height || 32) +'px'}"
          >
            <FormItem v-model="col.value" :type="col.type" :value="col.value" :disabled="col.disabled" />
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import FormItem from '@/modules/maintenance/components/FormItem'
export default {
  name: 'PMForm',
  components: { FormItem },
  props: {
    title: {
      type: String,
      default: '快捷操作'
    },
    formJson: {
      type: Array,
      default: () => { return [] }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-div {
  ::v-deep .el-row {
      border: 1px solid #9b9b9b;
      margin-bottom: -1px !important;

    .el-col:last-child {
      border: none;
    }

    .el-col {
      margin-bottom: -1px !important;
      border-bottom: 1px solid #9b9b9b;
      border-right: 1px solid #9b9b9b;
      line-height: 32px;
    }
  }
}
</style>
