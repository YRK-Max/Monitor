<template>
  <div class="main-div">
    <el-card :style="{width: device === 'mobile'?'90%':'50%'}">
      <div :style="{height: height + 'px'}" class="enable-scroll no-scroll-bar">
        <h3>工作交接单</h3>
        <el-divider />
        <el-row :gutter="8">
          <el-col :span="12">
            <label>录入人员</label><span>{{ username }}</span>
          </el-col>
          <el-col :span="12">
            <label>录入时间</label><span>{{ nowTime }}</span>
          </el-col>
          <el-col :span="24">
            <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
              <label>交接内容</label>
              <el-button type="primary" size="mini" plain circle icon="el-icon-plus" @click="handleAddContent" />
            </div>
            <el-table
              border
              stripe
              style="margin-top: 10px"
              :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
              :data="noteList"
            >
              <el-table-column
                width="55"
                type="index"
                label="NO."
              />
              <el-table-column
                prop="note"
                label="事项名称"
              >
                <template slot-scope="scope">
                  <label v-if="!scope.row['isSet']">{{ scope.row['note'] }}</label>
                  <el-input v-if="scope.row['isSet']" v-model="scope.row['note']" />
                </template>
              </el-table-column>
              <el-table-column width="100" label="操作">
                <template slot-scope="scope">
                  <el-button v-if="scope.row['isSet']" type="text" size="small" @click="handleSave(scope.row)">保存</el-button>
                  <el-button v-if="!scope.row['isSet']" type="text" size="small" @click="handleEdit(scope.row)">修改</el-button>
                  <el-divider direction="vertical" />
                  <el-button v-if="scope.row['isSet']" type="text" size="small" @click="handleCancel(scope.row)">取消</el-button>
                  <el-button v-if="!scope.row['isSet']" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <label>交接备注</label>
            <el-input type="textarea" rows="5" />
          </el-col>
          <el-col :span="24">
            <el-button style="float: right" type="primary">录入</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
export default {
  name: 'HandoverForm',
  data() {
    return {
      noteList: [
        { note: '机台清洁', isSet: false }
      ]
    }
  },
  computed: {
    height() {
      return this.$store.getters.body_height - 160
    },
    device() {
      return this.$store.getters.device
    },
    username() {
      return this.$store.getters.name
    },
    nowTime() {
      return parseTime(new Date(), undefined)
    }
  },
  methods: {
    handleAddContent() {
      if (!this.noteList[this.noteList.length - 1]['isSet']) {
        this.noteList.push({ note: '', isSet: true })
      }
    },
    handleSave(row) {
      row['isSet'] = false
    },
    handleCancel(row) {
      row['isSet'] = false
      const index = this.noteList.indexOf(row)
      this.noteList.splice(index, 1)
    },
    handleEdit(row) {
      row['isSet'] = true
    },
    handleDelete(row) {
      const index = this.noteList.indexOf(row)
      this.noteList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-div {
  padding: 15px 0 15px 0;
  display: flex;
  background: #eaeaea;
  justify-content: center;

  label {
    display: inline-block;
    font-weight: normal;
    width: 80px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  label+span{
    vertical-align: top;
  }

  ::v-deep .el-col {
    margin-bottom: 10px;
  }
  ::v-deep .el-table__row td {
    padding: 5px 0;
  }
}
</style>
