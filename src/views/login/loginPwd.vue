<template>
  <el-form ref="ruleForm" :model="formState" :rules="rules" label-width="0" status-icon class="login-ruleForm">
    <el-form-item prop="account">
      <el-input ref="account" v-model="formState.account" class="login-input" name="account" placeholder="请输入用户名"
        :clearable="true" tabindex="1" type="text" maxlength="100" autocomplete="off" :prefix-icon="User" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input ref="password" v-model="formState.password" class="login-input" show-password name="password"
        placeholder="请输入密码" :clearable="true" tabindex="2" maxlength="16"  autocomplete="off"
        @keyup.enter="loginHandle" :prefix-icon="Lock">
      
      </el-input>
    </el-form-item>

    <div class="form-text">谷歌验证码</div>

    <el-form-item class="input-items">
      <el-input type="text" ref="int1" maxlength="1" v-model="first" @input="firstChange" />
      <el-input type="text" ref="int2" maxlength="1" v-model="second" @input="secondChange" />
      <el-input type="text" ref="int3" maxlength="1" v-model="third" @input="thirdChange" />
      <el-input type="text" ref="int4" maxlength="1" v-model="fourth" @input="fourthChange" />
      <el-input type="text" ref="int5" maxlength="1" v-model="fifth" @input="fifthChange" />
      <el-input type="text" ref="int6" maxlength="1" v-model="sixth" @input="sixthChange" />
    </el-form-item>
    <div class="input-items-tip">如未设置，请置空</div>

    <el-form-item class="pt-[40px]">
      <el-button :loading="loading" round type="primary" class="login-btn" @click.prevent="loginHandle">
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, onBeforeMount, reactive, computed } from 'vue'
import { useUserStore } from '/@/store'
import { useRouter, useRoute } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { apiLogin } from '/@/api/modules/login.api'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const ruleForm = ref()
const trigger = ['blur', 'change']
const formState = reactive({
  account: '',
  password: ''
})
const rules = {
  account: [{ required: true, message: '请输入账号', trigger }],
  password: [{ required: true, message: '请输入密码', trigger }],
}
const loading = ref(false)
const showPwd = ref(false)

// 输入内容自动切换下一个输入框
const first = ref('')
const int1 = ref()

const second = ref('')
const int2 = ref()

const third = ref('')
const int3 = ref()

const fourth = ref('')
const int4 = ref()

const fifth = ref('')
const int5 = ref()

const sixth = ref('')
const int6 = ref()

// 第一个文本框 change 事件
function firstChange(e) {
  if (e) {
    int2.value.focus()
  } else {
    int1.value.focus()
    int2.value.blur()
  }
}
// 第二个文本框 change 事件
function secondChange(e) {
  if (e) {
    int3.value.focus()
  } else {
    int2.value.blur()
    int1.value.focus()
  }
}
// 第三个文本框 change 事件
function thirdChange(e) {
  if (e) {
    int4.value.focus()
  } else {
    int3.value.blur()
    int2.value.focus()
  }
}
// 第四个文本框 change 事件
function fourthChange(e) {
  if (e) {
    int5.value.focus()
  } else {
    int4.value.blur()
    int3.value.focus()
  }
}
// 第五个文本框 change 事件
function fifthChange(e) {
  if (e) {
    int6.value.focus()
  } else {
    int5.value.blur()
    int4.value.focus()
  }
}
// 第六个文本框 change 事件
function sixthChange(e) {
  if (e) {
    int6.value.focus()
  } else {
    int6.value.blur()
    int5.value.focus()
  }
}

const goSkipPage = ()=>{
  router.push('/dashboard')
}

function loginHandle() {
  loading.value = true
  ruleForm.value.validate(async valid => {
    if (valid) {
      try {
        const params = {
          username: formState.account,
          password: formState.password,
          googlecode: first.value + second.value + third.value + fourth.value + fifth.value + sixth.value
        }
        const data = await apiLogin(params)
        if (data) {
          const { auth, googlebind, expired } = data

          userStore.SET_TOKEN(auth)
          userStore.SET_USERNAME(formState.username)
          userStore.SET_USERINFO(data)
          // 清空登陆信息
          // formState.account = ''
          // formState.password = ''
          first.value = ''
          second.value = ''
          third.value = ''
          fourth.value = ''
          fifth.value = ''
          sixth.value = ''
          // ruleForm.value.resetFields();
          userStore.getAuthMatch().then(() => {
            if (!googlebind) {
              router.push('/googleValidator')
            } else {
              if (expired) {
                router.replace('/changePassword')
              } else {
                router.replace('/dashboard')
              }
            }
          });
          // userStore.SET_USERINFO( { userName : formState.account } )
          // appStore.SET_LANG( 'CN' )
          // 获取权限

        }
      } catch (e) {
      } finally {
        loading.value = false
      }
    } else {
      loading.value = false
    }
  })
}

defineOptions({
  name: 'LoginPwd'
})
</script>

<style lang="scss" scoped>

.el-form-item {
  margin-bottom: 20px;

  :deep(.el-input__prefix-inner) {
    color: #165DFF;
  }
  :deep(.el-input__icon){
    font-size: 18px;
  }
}

.form-text {
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color:#000;
}

.input-items {
  padding-top: 12px;
  margin-bottom: 10px;
  :deep(.el-form-item__content) {
    display: flex;
    justify-content: space-between;

    .el-input {
      width: 46px;
      height: 46px;
      box-sizing: border-box;
    
      .el-input__inner {
        text-align: center;
      }

      .el-input__wrapper {
        border-radius: 6px;
      }
    }
  }
}
.input-items-tip{
  color:#EF8401;
  line-height: 24px;
  margin-top: 10px;
  font-size: 16px;
}
.login-input{
  height: 48px;
}
.login-btn{
  width: 100%;
  height:48px;
  font-size: 16px;
  border-radius: 24px;
}
</style>
