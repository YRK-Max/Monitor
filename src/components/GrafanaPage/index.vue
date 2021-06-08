<template>
  <iframe width="100%" height="888px" :src="target" :frameborder="0" />
</template>

<script>
export default {
  name: 'GrafanaPage',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      src: ''
    }
  },
  computed: {
    target() {
      return this.url
    }
  }
}
</script>

<style scoped>

</style>
