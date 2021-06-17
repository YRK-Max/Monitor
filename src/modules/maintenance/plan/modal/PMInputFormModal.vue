<template>
  <el-dialog
    title="保养录入单"
    :visible.sync="realVisible"
    :before-close="handleClose"
  >
    <p-m-form title="保养录入单" :form-json="formJson" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="realVisible = false">取 消</el-button>
      <el-button type="primary" @click="realVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import PMForm from '@/modules/maintenance/components/PMForm'
export default {
  name: 'PMInputFormModal',
  components: { PMForm },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentPlanInfo: {
      type: Object,
      default: () => { return { name: '', content: [] } }
    }
  },
  data() {
    return {
      formJson: [],
      realVisible: false
    }
  },
  watch: {
    visible: {
      handler(n, o) {
        this.realVisible = n
        this.refreshData()
      },
      deep: true
    }
  },
  mounted() {
    this.realVisible = this.visible
    this.refreshData()
  },
  methods: {
    refreshData() {
      this.formJson = [
        {
          key: '1',
          children: [
            { type: 'label', value: '姓名', span: 6 },
            { type: 'input', value: '袁荣坤', span: 6, disabled: true },
            { type: 'label', value: '部门', span: 6 },
            { type: 'input', value: '软件部', span: 6, disabled: true }
          ]
        },
        {
          key: '2',
          children: [
            { type: 'label', value: '职务', span: 6 },
            { type: 'input', value: '开发工程师', span: 6, disabled: true },
            { type: 'label', value: '录入时间', span: 6, disabled: true },
            { type: 'input', value: '2021-06-12 01:12:22', span: 6, disabled: true }
          ]
        },
        {
          key: '3',
          children: [
            { type: 'label', value: '保养时间', span: 6 },
            { type: 'input', span: 18, value: '每周 2', disabled: true }
          ]
        },
        {
          key: '4',
          children: this.currentPlanInfo ? this.formatContent(this.currentPlanInfo['content']) : []
        },
        {
          key: '5',
          children: [
            { type: 'label', value: '保养耗材', span: 6 },
            { type: 'input', span: 18, value: '' }
          ]
        },
        {
          key: '7',
          children: [
            { type: 'label', value: '备注', span: 6, height: 118 },
            { type: 'textarea', span: 18, height: 118, value: '' }
          ]
        }
      ]
    },
    formatContent(list) {
      const arrayList = [
        { type: 'label', value: '保养事项', span: 24 }
      ]
      for (const content of list) {
        arrayList.push({ type: 'label', value: content['name'], span: 6 })
        arrayList.push({ type: 'contentLabel', disabled: true, span: 15, value: content['content'] })
        arrayList.push({ type: 'checkbox', value: content['state'] || false, span: 3 })
      }
      arrayList.push({ type: 'label', value: '-- 事项结束 --', span: 24 })
      return arrayList
    },
    handleClose() {
      this.$emit('close', false)
    }
  }
}
</script>

<style scoped>

</style>
