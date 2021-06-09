<template>
  <el-row class="main-row">
    <el-col :span="24">
      <el-card class="params-panel">
        <el-form ref="SearchForm" :model="searchForm" inline label-width="80px" label-position="left">
          <el-form-item label="角色名称" prop="username">
            <el-input v-model="searchForm.roleName" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24">
      <el-card
        class="content-panel"
        header="用户信息列表"
      >
        <el-row>
          <el-col :span="24">
            <div class="operation-panel">
              <el-button type="primary" icon="el-icon-plus" @click="handleAddRole">新增角色</el-button>
              <el-button v-if="selectedRoleList.length" type="danger" @click="handleBatchDelete">删除</el-button>
            </div>
          </el-col>
          <el-col :span="24">
            <el-table
              ref="UserTable"
              :data="displayRoleList"
              :header-cell-style="{background:'#f1f8ff',color:'#67718c'}"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column
                prop="name"
                label="Name"
              />
              <el-table-column
                prop="isDefault"
                label="Default"
              >
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row['isDefault']"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    disabled
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="isPublic"
                label="Public"
              >
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row['isPublic']"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    disabled
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="isStatic"
                label="Static"
              >
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row['isStatic']"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    disabled
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="active_state"
                label="操作"
                align="center"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <div class="operation-content" style="display: flex; align-content: center; justify-content: center">
                    <a @click="handleEdit(scope.row)">编辑</a>
                    <el-divider direction="vertical" />
                    <el-popconfirm
                      title="确定删除？"
                      @onConfirm="handleDeleteUser(scope.row)"
                    >
                      <a slot="reference">删除</a>
                    </el-popconfirm>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-drawer
      title="用户操作"
      size="20%"
      class="user-form-drawer"
      :visible.sync="drawerVisible"
    >
      <el-form
        ref="RoleForm"
        class="user-form"
        label-width="120px"
        label-position="left"
        :model="roleForm"
        :rules="roleFormRules"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="roleForm.name" style="width: 100%" />
        </el-form-item>
        <el-form-item label="isDefault" prop="isDefault">
          <el-switch
            v-model="isDefault"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="isPublic" prop="isPublic">
          <el-switch
            v-model="isPublic"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button v-if="mode==='add'" type="primary" @click="handleAddRoleConfirm">添加</el-button>
          <el-button v-if="mode==='edit'" type="primary">修改</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-row>
</template>

<script>
import { createRole, deleteRolesById, getRoles } from '@/api/user'

export default {
  name: 'UserManagement',
  data() {
    return {
      isDefault: false,
      isPublic: true,
      searchForm: {
        roleName: ''
      },
      roleForm: {
        name: ''
      },
      roleFormRules: {
        name: [
          { required: true, message: '请输入名字' }
        ]
      },
      displayRoleList: [],
      roleDatasource: [],
      total: 0,
      roleOptions: [],
      selectedRoleList: [],
      drawerVisible: false,
      mode: 'add'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.refreshRoleData()
      this.total = this.roleDatasource.length / 20
      this.refreshSelectData()
    },
    async refreshRoleData() {
      const res = await getRoles()
      if (res && res['items']) {
        this.roleDatasource = res['items']
        this.displayRoleList = res['items']
      }
    },
    handleSelectionChange(val) {
      this.selectedRoleList = val
    },
    async handleEdit(row) {
      this.roleForm = row['name']
      this.isPublic = row['isPublic']
      this.isDefault = row['isDefault']
      this.mode = 'edit'
      this.drawerVisible = true
    },
    handleDeleteUser(row) {
      if (row['id']) {
        deleteRolesById(row['id'])
        this.$message.success('删除成功')
        this.refreshRoleData()
      } else {
        this.$message.error('用户ID为空')
      }
    },
    handleBatchDelete() {
      if (this.selectedRoleList.length > 0) {
        this.selectedRoleList.forEach(role => {
          deleteRolesById(role['id'])
        })
        this.$message.success('批量删除成功')
        this.refreshRoleData()
      } else {
        this.$message.warning('请选择至少一个用户')
      }
    },
    handleSearch() {
      this.displayRoleList = this.roleDatasource.filter(role => { return role['name'].includes(this.searchForm.roleName) })
    },
    handleAddRole() {
      this.mode = 'add'
      this.drawerVisible = true
      this.roleForm = {
        userName: '',
        name: '',
        surname: '',
        email: '',
        phoneNumber: '',
        lockoutEnabled: true,
        roleNames: [],
        password: ''
      }
      this.resetUserForm()
    },
    handleAddRoleConfirm() {
      this.$refs['RoleForm'].validate((valid) => {
        if (valid) {
          const params = this.roleForm
          params['isDefault'] = this.isDefault
          params['isPublic'] = this.isPublic
          createRole(this.roleForm).then(() => {
            this.drawerVisible = false
            this.$message.success('创建成功')
          })
        } else {
          return false
        }
      })
    },
    resetUserForm() {
      this.$nextTick(() => {
        this.$refs['RoleForm'].resetFields()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-row {
  ::v-deep :focus {
    outline: none;
  }
}

.params-panel {
  background: #f7faff;
  height: 65px;
  margin: 5px;
  border-radius: 5px;
  display: flex;
  align-content: center;
  border: 1px solid #9cc4ff;

  ::v-deep .el-card__body{
    padding: 12px;
  }
}
.content-panel {
  margin: 5px;
}
.operation-panel {
  margin-bottom: 8px;
}
.operation-content {
  a {
    color: #0088ff;
  }
}

.user-form {
  margin: 8px;
}
</style>
