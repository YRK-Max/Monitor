<template>
  <el-row class="main-row">
    <el-col :span="24">
      <el-card class="params-panel">
        <el-form ref="SearchForm" :model="searchForm" inline label-width="80px" label-position="left">
          <el-form-item label="用户ID" prop="username">
            <el-input v-model="searchForm.username" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24">
      <div class="operation-panel">
        <el-button type="primary" @click="handleAddUser">新增</el-button>
        <el-button v-if="selectedUserList.length" type="danger" @click="handleBatchDelete">删除</el-button>
      </div>
    </el-col>
    <el-col :span="24">
      <el-card
        class="content-panel"
        header="用户信息列表"
      >
        <el-table
          ref="UserTable"
          :data="displayList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="userName"
            label="User Name"
          />
          <el-table-column
            prop="name"
            label="Name"
          />
          <el-table-column
            prop="email"
            label="Email"
          />
          <el-table-column
            prop="phoneNumber"
            label="Phone Number"
          />
          <el-table-column
            prop="creationTime"
            label="Creation Time"
            sortable
          />
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
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          style="margin: 10px; float: right"
          @cuechange="handleCurrentChange"
          @prev-click="handlePrevClick"
          @next-click="handleNextClick"
        />
      </el-card>
    </el-col>
    <el-drawer
      title="用户操作"
      size="20%"
      class="user-form-drawer"
      :visible.sync="drawerVisible"
    >
      <el-form
        ref="UserForm"
        class="user-form"
        label-width="120px"
        label-position="left"
        :model="userForm"
        :rules="userFormRules"
      >
        <el-form-item label="User Name" prop="userName">
          <el-input v-model="userForm.userName" :disabled="mode!=='add'" style="width: 100%" />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="userForm.name" style="width: 100%" />
        </el-form-item>
        <el-form-item label="Surname" prop="surname">
          <el-input v-model="userForm.surname" style="width: 100%" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="userForm.email" style="width: 100%" />
        </el-form-item>
        <el-form-item label="Phone Number" prop="phoneNumber">
          <el-input v-model="userForm.phoneNumber" style="width: 100%" />
        </el-form-item>
        <el-form-item label="Lockout" prop="lockoutEnabled">
          <el-switch
            v-model="userForm.lockoutEnabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="Role Names" prop="roleNames">
          <el-select
            v-model="userForm.roleNames"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="mode==='add'" label="Password" prop="password">
          <el-input v-model="userForm.password" style="width: 100%" />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button v-if="mode==='add'" type="primary" @click="handleAddUserConfirm">添加</el-button>
          <el-button v-if="mode==='edit'" type="primary">修改</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-row>
</template>

<script>
import { createUser, deleteUsersById, getRoles, getRolesByUserId, getUsers } from '@/api/user'

export default {
  name: 'UserManagement',
  data() {
    return {
      searchForm: {
        username: ''
      },
      userForm: {
        userName: '',
        name: '',
        surname: '',
        email: '',
        phoneNumber: '',
        lockoutEnabled: true,
        roleNames: [],
        password: ''
      },
      userFormRules: {
        userName: [
          { required: true, message: '请输入用户ID' }
        ],
        name: [
          { required: true, message: '请输入名字' }
        ],
        email: [
          { required: true, message: '请输入邮箱' }
        ],
        roleNames: [
          { required: true, message: '请选择角色' }
        ]
      },
      usersTableParam: {
        Filter: '',
        Sorting: '',
        SkipCount: 0,
        MaxResultCount: 20
      },
      displayList: [],
      userDatasource: [],
      total: 0,
      roleOptions: [],
      selectedUserList: [],
      drawerVisible: false,
      mode: 'add'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.refreshData()
      this.total = this.userDatasource.length / 20
      this.refreshSelectData()
    },
    async refreshData() {
      const res = await getUsers(this.usersTableParam)
      if (res && res['items']) {
        this.userDatasource = res['items']
        this.displayList = res['items']
      }
    },
    async refreshSelectData() {
      const res = await getRoles()
      if (res && res['items']) {
        this.roleOptions = res['items']
      }
    },
    handleCurrentChange(currentPage) {
      this.searchResult(currentPage)
    },
    handlePrevClick(currentPage) {
      if (currentPage > 0) {
        this.searchResult(currentPage - 1)
      }
    },
    handleNextClick(currentPage) {
      if (currentPage < (this.userDatasource.length / 20).toFixed(0)) {
        this.searchResult(currentPage + 1)
      }
    },
    searchResult(pageNumber) {
      this.usersTableParam.SkipCount = pageNumber
      this.refreshData()
    },
    handleSelectionChange(val) {
      this.selectedUserList = val
    },
    async handleEdit(row) {
      const roles = await getRolesByUserId(row['id'])
      this.userForm = row
      if (roles && roles['items']) {
        this.userForm.roleNames = roles['items']
      }
      this.mode = 'edit'
      this.drawerVisible = true
    },
    handleDeleteUser(row) {
      if (row['id']) {
        deleteUsersById(row['id'])
        this.$message.success('删除成功')
      } else {
        this.$message.error('用户ID为空')
      }
    },
    handleBatchDelete() {
      if (this.selectedUserList.length > 0) {
        this.selectedUserList.forEach(user => {
          deleteUsersById(user['id'])
        })
        this.$message.success('批量删除成功')
      } else {
        this.$message.warning('请选择至少一个用户')
      }
    },
    handleSearch() {
      this.displayList = this.userDatasource.filter(user => { return user['userName'].includes(this.searchForm.username) })
      console.log(this.displayList)
      console.log(this.userDatasource)
    },
    handleAddUser() {
      this.mode = 'add'
      this.drawerVisible = true
      this.userForm = {
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
    handleAddUserConfirm() {
      this.$refs['UserForm'].validate((valid) => {
        if (valid) {
          createUser(this.userForm)
        } else {
          return false
        }
      })
    },
    resetUserForm() {
      this.$nextTick(() => {
        this.$refs['UserForm'].resetFields()
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
  margin: 8px;
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
