<template>
  <iframe width="100%" height="888px" :src="target" :frameborder="0" />
</template>

<script>
export default {
  name: 'GrafanaPage',
  props: {
    ip: {
      type: String,
      default: '127.0.0.1'
    },
    port: {
      type: String,
      default: '3000'
    }
  },
  data() {
    return {
      src: ''
    }
  },
  computed: {
    target() {
      return 'http://' + this.ip + ':' + this.port + '/d/9CWBz0bik/bao-biao-fu-wu-qi-jian-kong?orgId=1&kiosk'
    }
  }
}
</script>

<style scoped>

</style>
