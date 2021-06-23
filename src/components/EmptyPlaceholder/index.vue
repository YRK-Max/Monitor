<template>
  <div v-show="isShow" class="main-div">
    <label>暂无内容</label>
  </div>
</template>

<script>
export default {
  name: 'EmptyPlaceholder',
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.main-div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
