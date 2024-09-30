<template>
  <el-form ref="ruleForm" :model="formState" :rules="rules" label-width="0" status-icon class="reset-el-styte">
    <p class="tip_word">请输入登录密码</p>
    <!-- <el-form-item prop="account">
      <el-input
        ref="account"
        v-model="formState.account"
        class="h50"
        name="account"
        placeholder="请输入用户名"
        :clearable="true"
        tabindex="1"
        type="text"
        maxlength="100"
        autocomplete="off"
        :prefix-icon="User"
      />
    </el-form-item> -->

    <el-form-item prop="password">
      <el-input
        ref="password"
        v-model="formState.password"
        class="h50"
        show-password
        name="password"
        placeholder="请输入登录密码"
        :clearable="true"
        tabindex="2"
        maxlength="16"
        type="password"
        autocomplete="off"
        @keyup.enter="loginHandle"
        :prefix-icon="Lock"
      />
    </el-form-item>

    <el-form-item prop="secondPassword">
      <el-input
        ref="secondPassword"
        v-model="formState.secondPassword"
        class="h50"
        show-password
        name="secondPassword"
        placeholder="请再次输入登录密码"
        :clearable="true"
        tabindex="2"
        maxlength="16"
        type="password"
        autocomplete="off"
        @keyup.enter="loginHandle"
        :prefix-icon="Lock"
      />
    </el-form-item>

    <!-- <p class="tip_word">请输入两步验证密码</p>
    <el-form-item prop="verifyPassword">
      <el-input
        ref="verifyPassword"
        v-model="formState.verifyPassword"
        class="h50"
        show-password
        name="verifyPassword"
        placeholder="请输入验证密码"
        :clearable="true"
        tabindex="2"
        maxlength="16"
        type="password"
        autocomplete="off"
        @keyup.enter="loginHandle"
        :prefix-icon="Lock"
      />
    </el-form-item> -->

    <div class="form-text">谷歌验证码</div>

    <el-form-item class="input-items" prop="">
      <!-- <el-input
        ref="password"
        v-model="formState.captcha"
        class="h50"
        show-password
        name="password"
        placeholder="请输入谷歌验证码"
        :clearable="true"
        tabindex="2"
        maxlength="16"
        type="password"
        autocomplete="off"
        @keyup.enter="loginHandle"
      /> -->
      <el-input type="text" ref="int1" maxlength="1" v-model="first" @input="firstChange" />
      <el-input type="text" ref="int2" maxlength="1" v-model="second" @input="secondChange" />
      <el-input type="text" ref="int3" maxlength="1" v-model="third" @input="thirdChange" />
      <el-input type="text" ref="int4" maxlength="1" v-model="fourth" @input="fourthChange" />
      <el-input type="text" ref="int5" maxlength="1" v-model="fifth" @input="fifthChange" />
      <el-input type="text" ref="int6" maxlength="1" v-model="sixth" @input="sixthChange" />
    </el-form-item>

    <el-form-item style="margin-bottom: 14px">
      <el-button
        class="h50"
        :loading="loading"
        :disabled="disabledLogin"
        type="primary"
        style="width: 100%"
        @click.prevent="loginHandle"
      >
        修 改
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, onBeforeMount, reactive, computed } from 'vue'
import { useUserStore } from '/@/store'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { updatePwd } from '/@/api/modules/login.api'
import { set } from '@vueuse/core'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const ruleForm = ref()
const trigger = ['blur', 'change']
const formState = reactive({
  secondPassword: '',
  password: '',
})
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== formState.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}
const rules = {
  password: [{ required: true, message: '请输入新的密码', trigger }],
  secondPassword: [
    { required: true, message: '请再次确认新密码', trigger },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

const loading = ref(false)

const disabledLogin = computed(() => {
  return !(
    formState.password &&
    formState.secondPassword &&
    first.value.length === 1 &&
    second.value.length === 1 &&
    third.value.length === 1 &&
    fourth.value.length === 1 &&
    fifth.value.length === 1 &&
    sixth.value.length === 1
  )
})

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

function loginHandle() {
  loading.value = true
  ruleForm.value.validate(async valid => {
    if (valid) {
      try {
        const params = {
          password: formState.password,
          googlecode: first.value + second.value + third.value + fourth.value + fifth.value + sixth.value,
        }
        await updatePwd(params)
        ElNotification({
          title: '操作成功',
          message: '密码修改成功',
          type: 'success',
        })
        setTimeout(() => {
          router.replace('/')
        }, 500)
      } catch (e) {
        console.log(e)
      } finally {
        loading.value = false
      }
    } else {
      loading.value = false
    }
  })
}

defineOptions({
  name: 'ResetPwd',
})
</script>

<style lang="scss" scoped>
.tip_word {
  font-family: 'Poppins';
  font-size: 14px;
  margin-bottom: 11px;
}
.el-form-item {
  margin-bottom: 28px;
  :deep(.el-input__prefix-inner) {
    color: #165DFF;
  }
}
.form-text {
  text-align: center;
  margin-bottom: 28px;
  font-family: 'Roboto';
  font-weight: 400;
  font-size: 16px;
}
.input-items {
  :deep(.el-form-item__content) {
    display: flex;
    justify-content: space-between;
    .el-input {
      width: 46px;
      height: 46px;
      background-color: #fff;
      box-sizing: border-box;
      .el-input__inner {
        text-align: center;
      }
    }
  }
}
</style>
