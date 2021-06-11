<template>
  <div class="login-container">
    <div class="mt-20 title-div">
      <div :class="[ 'relative', 'ml-10', '-enter-x']">
        <div style="display: flex; width: 60%; height: 60px;">
          <img src="@/assets/image/logo.png">
          <label style="display: inline-block; line-height: 60px; font-size: 30px; margin-left: 10px; color: #f6f6f6">EcoFabb
            MTS</label>
        </div>
        <div class="mt-45">
          <img style="width: 350px" src="@/assets/svg/login-box-bg.svg" alt="">
        </div>
        <div class="mt-10 font-medium text-white">
          <span class="mt-4 text-3xl inline-block">智慧工厂监控运维系统</span>
        </div>
        <div class="mt-5 text-md text-white font-normal">
          面向制造企业车间各类服务进程监控和管理的辅助类应用程序
        </div>
      </div>
    </div>
    <div class="login-form-div">
      <el-form
        ref="loginForm"
        class="login-form"
        :model="loginForm"
        :rules="loginRules"
        autocomplete="on"
        label-position="left"
      >
        <div class="title-container enter-x">
          <h2 class="font-bold text-2xl xl:text-3xl text-center xl:text-left mb-6">
            {{ $t('login.title') }}
          </h2>
          <lang-select class="set-language" />
        </div>

        <el-form-item prop="username" class="enter-x-7">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password" class="enter-x-8">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              :placeholder="$t('login.password')"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-button
          class="enter-x-9"
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >
          {{ $t('login.logIn') }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'

export default {
  name: 'Login',
  components: { LangSelect },
  data() {
    const validateUsername = (rule, value, callback) => {
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
              this.$notify({
                title: '登录成功',
                message: '欢迎您, ' + this.loginForm.username,
                type: 'success'
              })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: aliceblue;
$light_gray: #bebebe;
$cursor: #5f5f5f;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #ffffff;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  display: flex;
  justify-content: space-around;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin-left: -48%;
    background-image: url('~@/assets/svg/login-bg.svg');
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: auto 100%;
    content: '';
    @media (max-width: 1200px) {
      display: none;
    }
  }

  .title-div {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    @media (max-width: 1200px) {
      display: none;
    }
  }

  .login-form-div {
    padding: 1rem;
    background: white;
    flex-grow: 3;
    display: flex;
    justify-content: center;
    align-content: center;
    margin-top: 16%;

    .login-form {
      position: fixed;
      width: 400px;

      ::v-deep .el-form-item__content{
        background: aliceblue;
      }

      @media (max-width: 1200px) {
        width: 90%;
      }
    }

    @media (max-width: 1200px) {
      position: absolute;
      margin: auto;
      left: 10px;
      right: 10px;
      top: 100px;
      bottom: 100px;
      border-radius: 8px;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #545454;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 14px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }

  @media (max-width: 1200px) {
    background: #1f233d;
  }
}

.enter-x {
  -webkit-animation: slide-in-right 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: slide-in-right 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.enter-x-7 {
  -webkit-animation: slide-in-right 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: slide-in-right 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.enter-x-8 {
  -webkit-animation: slide-in-right 0.8s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: slide-in-right 0.8s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.enter-x-9 {
  -webkit-animation: slide-in-right 0.9s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: slide-in-right 0.9s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.-enter-x {
  -webkit-animation: slide-in-left 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: slide-in-left 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.mt-20 {
  margin-top: 100px;
}

.mt-45 {
  margin-top: 180px;
}

.mt-5 {
  margin-top: 15px;
}

.mt-10 {
  margin-top: 30px;
}

.mt-50 {
  margin-top: 150px;
}

.ml-10 {
  margin-left: 10px;
}

.text-white {
  color: white;
}

.font-medium {
  font-size: 30px;
}

.font-normal {
  font-size: 16px;
}
</style>
