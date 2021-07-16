<template>
  <el-dialog
    :title="'程序管理 -- ' + programName"
    :visible.sync="dialogVisible"
    width="700px"
  >
    <el-table
      :data="packageList"
      stripe
      height="350"
    >
      <el-table-column label="版本号" prop="programVersion" />
      <el-table-column label="描述" prop="programDesc" />
      <el-table-column label="文件名" prop="programFileData.fileName" />
      <el-table-column label="文件大小" prop="programFileData.fileSize" />
      <el-table-column width="100" label="操作">
        <template slot-scope="scope">
          <el-popconfirm
            title="确定删除吗？"
            @onConfirm="handleDelete(scope.row)"
          >
            <el-button slot="reference" type="text" size="small">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { deletePackage } from '@/api/monitor'

export default {
  name: 'ProgramManageModal',
  props: {
    packageList: {
      type: Array,
      default: () => {
        return []
      }
    },
    programName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
    },
    handleDelete(row) {
      deletePackage([row['programPackageId']]).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
