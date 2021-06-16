<template>
  <div>
    <div class="main-item">
      <div :class="alarmCount >0?'alarm':'normal'">
        <svg-icon class="bell-icon" class-name="bell-icon" icon-class="bell" @click="click" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  data() {
    return {
      alarmCount: 0
    }
  },
  methods: {
    click() {

    }
  }
}
</script>

<style scoped>
.bell-icon {
  cursor: pointer;
  font-size: 20px;
}

.main-item {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nomral {
  font-weight: bold;
  color: currentColor;
}

.alarm {
  width: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 5px;
  color: white;
  animation: blink-red-white 1s infinite;
}

@keyframes blink-red-white {
  0% {
    background: white;
    color: currentColor;
  }
  50% {
    background: #ff4c4c;
    color: white;
  }
  100% {
    background: white;
    color: currentColor;
  }
}
</style>
