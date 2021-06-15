<template>
  <iframe width="100%" :height="height + 'px'" :src="target" :frameborder="0" />
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
    },
    height() {
      return this.$store.getters.body_height - 88
    }
  }
}
</script>

<style scoped>

</style>
