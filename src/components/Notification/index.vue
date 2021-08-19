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
            :url="alarm['url']"
          />
        </div>
        <div class="button-panel">
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
import { deleteAlarm, getAllAlarmList } from '@/api/monitor'
export default {
  name: 'Notification',
  components: { EmptyPlaceholder, MessageCard },
  data() {
    return {
      alarmList: [],
      timer: null
    }
  },
  created() {
    this.timer = null
    this.getAlarmData()
    this.timer = setInterval(() => {
      this.getAlarmData()
    }, 1000 * 60)
  },
  methods: {
    getAlarmData() {
      getAllAlarmList().then(res => {
        if (res && res['status']) {
          this.alarmList = []
          const result = res['res']
          result.forEach(r => {
            if (r['alarmStatus']) {
              const alarm = {}
              const alarm_data = JSON.parse(r['alarmData'])
              alarm['id'] = r['id']
              alarm['type'] = r['alarmType']
              alarm['time'] = r['alarmTime'].substring(0, 19).replaceAll('T', ' ')
              alarm['content'] = alarm_data['title']
              alarm['source'] = alarm_data['evalMatches'][0]['tags']['instance']
              alarm['url'] = alarm_data['ruleUrl'].replace('localhost', '10.3.5.124')
              this.alarmList.push(alarm)
            }
          })
        } else {
          this.$message.error('获取报警数据失败')
        }
      })
    },
    handlerClear() {
      this.alarmList.forEach(alarm => {
        deleteAlarm(alarm['id']).then(res => {
          if (res && res['status']) {
            this.alarmList = []
          }
        })
      })
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
