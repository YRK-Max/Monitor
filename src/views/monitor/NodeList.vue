<template>
  <el-row class="main-row">
    <el-col :span="24">
      <div class="params-panel">
        <el-form inline label-position="left">
          <el-form-item label="IP" label-width="50px">
            <el-input style="width: 250px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    <el-col :span="24">
      <div style="margin: 10px">
        <label>Grafana Server : </label><label style="color: #0090ff">{{ Grafana.server }}</label>
        <label style="margin-left: 15px">UID : </label><label style="color: #0090ff">{{ Grafana.uid }}</label>
        <label style="margin-left: 15px">Name : </label><label style="color: #0090ff">{{ Grafana.name }}</label>
      </div>
    </el-col>
    <el-col :span="24">
      <el-card
        style="margin: 5px; width: calc(100% - 10px)"
        header
      >
        <div slot="header" class="clearfix">
          <span>Active Targets</span>
        </div>
        <el-table
          :data="nodeList"
          :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
          tooltip-effect="dark"
          @row-click="handleRowClick"
        >
          <el-table-column
            prop="labels.job"
            label="JOB"
          />
          <el-table-column
            prop="health"
            label="Status"
          >
            <template slot-scope="scope">
              <div style="display: flex; align-content: center">
                <i :class="['yicon-common', 'yiconB', scope.row['health']]" />
                <el-tag :type="scope.row['health'] === 'up'?'success':'danger'" size="small">{{
                  scope.row['health']
                }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="labels.instance"
            label="Node"
            sortable
          />
          <el-table-column
            prop="lastError"
            label="Last Error"
            :show-overflow-tooltip="true"
          />
        </el-table>
      </el-card>
      <el-card
        style="margin: 5px; width: calc(100% - 10px)"
        header
      >
        <div slot="header" class="clearfix">
          <span>Dropped Targets</span>
        </div>
        <el-table
          :data="droppedNodes"
          :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
          tooltip-effect="dark"
          @row-click="handleRowClick"
        >
          <el-table-column
            prop="labels.job"
            label="JOB"
          />
          <el-table-column
            prop="health"
            label="Status"
          >
            <template slot-scope="scope">
              <div style="display: flex; align-content: center">
                <i :class="['yicon-common', 'yiconB', scope.row['health']]" />
                <el-tag :type="scope.row['health'] === 'up'?'success':'danger'" size="small">{{
                  scope.row['health']
                }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="labels.instance"
            label="Node"
            sortable
          />
          <el-table-column
            prop="lastError"
            label="Last Error"
          />
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { getNodeList } from '@/api/prometheus'

export default {
  name: 'NodeList',
  data() {
    return {
      Grafana: {
        server: '10.3.5.113:3000',
        uid: '9CWBz0bik',
        name: 'identity'
      },
      nodeList: [],
      droppedNodes: []
    }
  },
  created() {
    this.initNodeData()
  },
  methods: {
    handleRowClick(row) {
      const params = { server: this.Grafana.server, uid: this.Grafana.uid, name: this.Grafana.name, job: row['labels']['job'], node: row['labels']['instance'] }
      console.log(row)
      console.log(params)
      this.$router.push({
        name: 'Grafana',
        params: params
      })
    },
    async initNodeData() {
      const result = await getNodeList()
      if (result['status'] === 'success') {
        console.log(result)
        this.nodeList = result['data']['activeTargets']
        this.droppedNodes = result['data']['droppedTargets']
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.params-panel {
  background: #f7faff;
  height: 60px;
  margin: 5px;
  padding: 8px;
  border-radius: 5px;
  display: flex;
  align-content: center;
  border: 1px solid #9cc4ff;
}

.up {
  margin-right: 10px;
  font-size: 20px;
  color: #42b983;
}

.down {
  margin-right: 10px;
  font-size: 20px;
  color: #d02828;
}
</style>
