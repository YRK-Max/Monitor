<template>
  <el-select
    v-model="model"
    clearable
    placeholder="请选择"
    @clear="handleClear"
    @change="handleChange"
  >
    <el-option
      v-for="item in optionsList"
      :key="item[optionConfig.value]"
      :label="item[optionConfig.label]"
      :value="item[optionConfig.value]"
    />
  </el-select>
</template>

<script>
import cis_request from '@/utils/request-cis'

export default {
  name: 'QuerySelect',
  model: {
    prop: 'model',
    event: 'changed'
  },
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    url: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => { return {} }
    },
    optionConfig: {
      type: Object,
      default: () => { return { label: 'label', value: 'value' } }
    }
  },
  data() {
    return {
      optionsList: [],
      model: ''
    }
  },
  created() {
    this.queryResult()
  },
  methods: {
    queryResult() {
      if (this.url) {
        cis_request({
          url: this.url,
          method: 'get',
          params: this.params
        }).then(res => {
          this.optionsList = res
        })
      } else {
        this.optionsList = this.options
      }
    },
    handleChange(val) {
      if (val) {
        this.$emit('changed', val)
      }
    },
    handleClear() {
      this.$emit('changed', '')
    }
  }
}
</script>

<style scoped>

</style>
