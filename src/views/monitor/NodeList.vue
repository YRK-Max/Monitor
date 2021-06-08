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
            prop="title"
            label="Title"
          />
          <el-table-column
            prop="uid"
            label="uid"
          />
          <el-table-column
            prop="url"
            label="url"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="job"
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
            prop="instance"
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
            prop="title"
            label="Title"
          />
          <el-table-column
            prop="uid"
            label="uid"
          />
          <el-table-column
            prop="url"
            label="url"
          />
          <el-table-column
            prop="job"
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
import { getDatasources, getJobList, getNodeList, getStatus, getTemplatingLabel } from '@/api/prometheus'

export default {
  name: 'NodeList',
  data() {
    return {
      Grafana: {
        server: '10.3.5.124:3000'
      },
      nodeList: [],
      droppedNodes: []
    }
  },
  created() {
    getDatasources().then(res => {
      console.log(res)
    })
    this.initNodeData()
  },
  methods: {
    handleRowClick(row) {
      const pinyin = require('pinyin')
      const params = { server: this.Grafana.server, uid: row['uid'], name: pinyin(row['title'], { style: pinyin.STYLE_NORMAL }).join('-'), job: row['job'], node: row['instance'] }
      console.log(row)
      console.log(params)
      this.$router.push({
        name: 'Grafana',
        params: params
      })
    },
    async initNodeData() {
      const finalList = []
      const results = await getNodeList()
      const status = await getStatus()
      for (const result of results) {
        const nodeResult = await getTemplatingLabel(result['uid'])
        const dashboard = nodeResult['dashboard']
        if (dashboard['templating'] && dashboard['templating']['list']) {
          const templating = dashboard['templating']['list']
          const templateJobList = templating.filter(t => { return t['name'] === 'job' })
          if (templateJobList.length > 0) {
            const query = templateJobList[0]['query'].split('(')[1].split(',')[0]
            const jobList = await getJobList(query)
            console.log(jobList)
            if (jobList['data'] && jobList['data']['result']) {
              jobList['data']['result'].forEach(m => {
                const metric = JSON.parse(JSON.stringify((m['metric'])))
                const temp = JSON.parse(JSON.stringify(result))
                temp['hostname'] = metric['hostname']
                temp['instance'] = metric['instance']
                temp['job'] = metric['job']
                for (const s of status['data']['activeTargets']) {
                  if (s['labels']['job'] === temp['job']) {
                    temp['health'] = s['health']
                    temp['lastError'] = s['lastError']
                  }
                }
                finalList.push(temp)
              })
            }
          }
        }
      }
      console.log(finalList)
      this.nodeList = finalList
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
