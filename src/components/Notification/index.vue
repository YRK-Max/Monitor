<template>
  <div>
    <div class="main-item">
      <el-popover
        placement="bottom-start"
        title="报警消息"
        width="400"
        trigger="hover"
      >
        <div class="message-box-div">
          <empty-placeholder :is-show="alarmList.length===0" />
          <message-card
            v-for="alarm in alarmList"
            :key="alarmList.indexOf(alarm)"
            class="message-card"
            :type="alarm['type']"
            :time="alarm['time']"
            :source="alarm['source']"
            :content="alarm['content']"
          />
        </div>
        <div class="button-panel">
          <el-button style="margin-top: 15px" @click="handlerMoreClick">查看更多</el-button>
          <el-button type="primary" plain style="margin-top: 15px" @click="handlerClear">一键清除</el-button>
        </div>
        <div slot="reference" :class="alarmList.length >0?'alarm':'normal'">
          <svg-icon class="bell-icon" class-name="bell-icon" icon-class="bell" />
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import MessageCard from '@/views/notification/components/MessageCard'
import EmptyPlaceholder from '@/components/EmptyPlaceholder'
export default {
  name: 'Notification',
  components: { EmptyPlaceholder, MessageCard },
  data() {
    return {
      alarmList: [
        { type: 'severe', time: '2021-06-04 14:00:00', source: '10.3.5.124:8081', content: '测试测试u成都上课纪律部队数据库表设计考虑搬家' },
        { type: 'mid', time: '2021-06-04 14:00:00', source: '10.3.5.124:8081', content: '测试测试u成都上课纪律部队数据库表设计考虑搬家' },
        { type: 'info', time: '2021-06-04 14:00:00', source: '10.3.5.124:8081', content: '测试测试u成都上课纪律部队数据库表设计考虑搬家' }
      ]
    }
  },
  methods: {
    handlerMoreClick() {
      this.$router.push('alarmList')
    },
    handlerClear() {
      this.alarmList = []
    }
  }
}
</script>

<style lang="scss" scoped>
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

.message-box-div {
  height: 260px;
  overflow: auto;
}
.message-box-div::-webkit-scrollbar { width: 0 !important }
.message-box-div { -ms-overflow-style: none; }
.message-box-div { overflow: -moz-scrollbars-none; }

.message-card {
  margin-bottom: 8px;
}

.button-panel {
  display: flex;
  justify-content: space-around;
  align-items: center;

  ::v-deep .el-button {
    flex-grow: 1;
  }
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
