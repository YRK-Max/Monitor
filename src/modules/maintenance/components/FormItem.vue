<template>
  <div class="main-item">
    <label v-if="type==='label'" class="align-center">{{ value }}</label>
    <label v-if="type==='contentLabel'" class="ml-8">{{ value }}</label>
    <el-input v-if="type==='input'" v-model="model" :disabled="disabled" @change="handleChange" />
    <el-input v-if="type==='textarea'" v-model="model" type="textarea" :disabled="disabled" :rows="5" @change="handleChange" />
    <el-checkbox v-if="type==='checkbox'" v-model="model" class="align-center" />
  </div>
</template>

<script>
export default {
  name: 'FormItem',
  model: {
    prop: 'model',
    event: 'changed'
  },
  props: {
    type: {
      type: String,
      default: 'label'
    },
    // eslint-disable-next-line vue/require-prop-types
    value: {
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: null
    }
  },
  mounted() {
    this.model = this.value
  },
  methods: {
    handleChange(val) {
      const value = val['target'] ? val['target']['value'] : (val['value'] || val)
      this.$emit('changed', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.align-center {
  display: inline-block;
  width: 100%;
  text-align: center !important;
}
.ml-8 {
  margin-left: 8px;
}
.main-item {
  width: 100%;
  height: 100%;

  label {
    font-weight: normal;
    display: inline-block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ::v-deep input {
    border: 0;
    color: black !important;
    height: 30px;
  }

  ::v-deep textarea {
    border: 0;
    color: black;
  }
}
</style>
