<template>
  <iframe width="100%" height="888px" :src="target" :frameborder="0" />
</template>

<script>
export default {
  name: 'GrafanaPage',
  props: {
    server: {
      type: String,
      default: '127.0.0.1:9100'
    },
    uid: {
      type: String,
      default: '9CWBz0bik'
    },
    name: {
      type: String,
      default: 'identity'
    },
    job: {
      type: String,
      default: ''
    },
    node: {
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
      console.log('http://' + this.server + '/d/' + this.uid + '/' + this.name + '?orgId=1&kiosk&var-origin_prometheus=&var-job=' + this.job + '&var-hostname=All&var-node=' + this.node + '&var-device=All&var-interval=2m&var-maxmount=%2F&var-show_hostname=localhost.localdomain&var-total=1')
      return 'http://' + this.server + '/d/' + this.uid + '/' + this.name + '?orgId=1&kiosk&var-origin_prometheus=&var-job=' + this.job + '&var-hostname=All&var-node=' + this.node + '&var-device=All&var-interval=2m&var-maxmount=%2F&var-show_hostname=localhost.localdomain&var-total=1'
    }
  }
}
</script>

<style scoped>

</style>
