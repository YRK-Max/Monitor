<template>
  <iframe style="margin-left: -60px" width="110%" :height="height + 'px'" src="http://10.3.5.124:3000/alerting/list" :frameborder="0" />
</template>

<script>
export default {
  name: 'AlarmSetting',
  data() {
    return {
      src: ''
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height - 88
    }
  },
  mounted() {
    console.log(window.location)
  }
}
</script>

<style scoped>

</style>
