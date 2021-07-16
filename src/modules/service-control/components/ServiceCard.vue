<template>
  <el-card
    shadow="hover"
    class="main-card"
    :body-style="{padding: '15px'}"
  >
    <div
      class="content"
      @click="handleClick"
    >
      <div :style="{ background: type==='service'?'#a2a2ff':'#f3721c' }" class="logo-image">{{ title }}</div>
      <div v-if="type==='service'" style="flex-grow: 1" class="info-card">
        <label>服务名称: </label><label class="info-label">{{ serviceName }}</label>
        <br>
        <label>最新版本号: </label><label class="info-label">{{ version }}</label>
        <br>
        <label>服务描述: </label><label>{{ description }}</label>
      </div>
      <div v-if="type==='instance'" style="flex-grow: 1" class="info-card">
        <label>Host: </label><label class="info-label">{{ hostname }}</label>
        <br>
        <label>OS: </label><label>{{ os }}</label>
        <br>
        <label>版本: </label><label>{{ description }}</label>
      </div>
      <div v-if="isManager" style="display: flex; justify-content: center; align-items: center;">
        <el-button type="primary" plain circle icon="el-icon-setting" @click="handlerManageClick" />
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ServiceCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    serviceName: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'service'
    },
    hostname: {
      type: String,
      default: ''
    },
    os: {
      type: String,
      default: ''
    },
    isManager: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      if (this.type === 'service') {
        this.$emit('click', this.serviceName)
      } else if (this.type === 'instance') {
        this.$emit('click', { host: this.hostname, type: this.title })
      }
    },
    handlerManageClick(e) {
      e.stopPropagation()
      this.$emit('manage', { programName: this.title, version: this.version })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-card {
  background: white;
  min-width: 496px;
}
.main-card:hover {
  background: #e6f3ff;
  .logo-image {
      -webkit-animation: wobble-hor-bottom 0.8s both;
      animation: wobble-hor-bottom 0.8s both;
  }
}
.content {
  display: flex;
  justify-content: space-around
}
.content div:last-child {
  margin-right: 0 !important;
}
.logo-image {
  margin-right: 10px;
  height: 65px;
  width: 110px;
  text-align: center;
  line-height: 60px;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  flex-basis: 110px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0 6px;
}
.info-card {
  margin-top: 6px;
  label {
    font-weight: normal;
    font-size: 14px;
  }

  .info-label {
    font-size: 14px;
    font-weight: bold;
    color: #3a93ff;
  }
}
</style>
