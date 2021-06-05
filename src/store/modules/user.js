import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  username: '',
  id: '',
  email: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    const params = { client_id: 'CISServer_App', client_secret: '1q2w3e*', grant_type: 'password', username: username.trim(), password: password }
    return new Promise((resolve, reject) => {
      login(params).then(response => {
        const data = response
        commit('SET_TOKEN', data['access_token'])
        setToken(data['access_token'])
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const data = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { role, name, given_name, sub, email, introduction } = data

        // 请求的role可能是string(一个权限)或是Array(多个权限), 需要将string转成Array用于后续按照权限生成路由
        // 也可能出现没有role的情况
        let roles
        if (typeof role === 'string') {
          roles = [role]
        } else {
          roles = role
        }
        data['roles'] = roles
        // console.log(data)

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('没有角色权限的账户无法登录!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', given_name)
        commit('SET_USERNAME', name)
        commit('SET_ID', sub)
        commit('SET_EMAIL', email)
        commit('SET_AVATAR', '/avatar.svg')
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
