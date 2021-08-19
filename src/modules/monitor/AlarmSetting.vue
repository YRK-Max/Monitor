<template>
  <iframe style="margin-left: -60px" width="110%" :height="height + 'px'" :src="src" :frameborder="0" />
</template>

<script>
import { getGrafanaDashboardConfs } from '@/api/monitor'

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
  created() {
    getGrafanaDashboardConfs().then(res => {
      if (res && res.length > 0) {
        const result = res[0]['url'].split('/')
        this.src = result[0] + '//' + result[2] + '/alerting'
      } else {
        this.$message.error('暂未配置任何看板')
      }
    })
  }
}
</script>

<style scoped>

</style>
