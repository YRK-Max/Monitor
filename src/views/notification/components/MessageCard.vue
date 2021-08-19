<template>
  <el-card
    class="main-card"
    shadow="hover"
    @click.native="handlerClick"
  >
    <el-row :gutter="8">
      <el-col :span="10">
        <label>类型</label>
        <el-tag size="small" :type="degree">{{ type }}</el-tag>
      </el-col>
      <el-col :span="14">
        <label>发生时间</label>
        <el-tag size="small" :type="degree">{{ time }}</el-tag>
      </el-col>
      <el-col :span="24">
        <label>来源</label>
        <el-tag size="small" :type="degree">{{ source }}</el-tag>
      </el-col>
      <el-col :span="24">
        <label>内容</label>
        <label class="content-label">{{ content }}</label>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'MessageCard',
  props: {
    type: {
      type: String,
      default: 'null'
    },
    time: {
      type: String,
      default: 'null'
    },
    source: {
      type: String,
      default: 'null'
    },
    content: {
      type: String,
      default: 'null'
    },
    url: {
      type: String,
      default: 'null'
    }
  },
  computed: {
    degree() {
      switch (this.type) {
        case 'CRITICAL':
        case 'MAJOR': return 'danger'
        case 'MINOR':
        case 'WARNING': return 'warning'
        default: return 'info'
      }
    }
  },
  methods: {
    handlerClick() {
      this.$router.push({
        name: 'Grafana',
        params: { url: this.url }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-card {
  width: 100%;
  height: 100px;

  ::v-deep .el-card__body {
    padding: 10px;
  }

  ::v-deep .el-col {
    margin-bottom: 8px;
    label {
      margin-right: 10px;
    }
  }
}

.main-card:hover {
  background: #f5ffe5;
}

.content-label {
  font-weight: normal;
  display: inline-block;
  width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: top;
}
</style>
