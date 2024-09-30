<template>
  <el-form ref="ruleForm" label-position="top" :model="formState" v-loading="loadingPage" status-icon
    class="login-ruleForm">
    <div class="form-center" style="margin-bottom: 30px; display: flex; justify-content: center">
      <qrcode-vue :value="link" :size="138" level="H" />
    </div>
    <el-form-item label="谷歌密钥" style="margin-bottom: 10px">
      <el-input readonly v-model="qrcode" class="h50">
        <template #suffix>
          <div class="suffix" @click="copy">
            <span>Copy</span>
          </div>
        </template>
      </el-input>
      <!-- <span class="txt-gray text-sm leading-6 mt-2">
        1、在您的手机上安装「Google Authentication」 <br>
        2、在「Google Authentication」中创建一个账户，扫码或手动输入秘钥，完成“添加”
      </span> -->
    </el-form-item>
    <div class="form-center my-5">谷歌验证码</div>

    <el-form-item class="input-items" prop="">
      <el-input type="text" ref="int1" maxlength="1" v-model="first" @input="firstChange" />
      <el-input type="text" ref="int2" maxlength="1" v-model="second" @input="secondChange" />
      <el-input type="text" ref="int3" maxlength="1" v-model="third" @input="thirdChange" />
      <el-input type="text" ref="int4" maxlength="1" v-model="fourth" @input="fourthChange" />
      <el-input type="text" ref="int5" maxlength="1" v-model="fifth" @input="fifthChange" />
      <el-input type="text" ref="int6" maxlength="1" v-model="sixth" @input="sixthChange" />
    </el-form-item>

    <el-form-item style="margin-bottom: 14px">
      <el-button class="h50" :loading="loading" type="primary" style="width: 100%" @click.prevent="loginHandle">
        绑定
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ElMessage, ElNotification } from 'element-plus'
import { ref, reactive, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { getGoogleCode, bindGoogleCode } from '/@/api/modules/login.api'
// import { useUserStore } from '/@/store'
import { useRouter } from 'vue-router'
// import { Lock } from '@element-plus/icons-vue'
import { useUserStore } from '/@/store'
const router = useRouter()
const ruleForm = ref()
// const trigger = ['blur', 'change']
const formState = reactive({})
const loadingPage = ref(true)
const loading = ref(false)
const disabledLogin = computed(() => {
  return !(
    first.value.length === 1 &&
    second.value.length === 1 &&
    third.value.length === 1 &&
    fourth.value.length === 1 &&
    fifth.value.length === 1 &&
    sixth.value.length === 1
  )
})

const link = ref('')
const qrcode = ref('')
getGoogleCode().then(res => {
  link.value = res.googlesecretqr
  qrcode.value = res.googlesecret
  if (res.googlebind) {
    useUserStore().LOGOUT()
    router.replace('/login')
  }
}).finally(() => {
  loadingPage.value = false;
})
const copy = () => {
  const text = qrcode.value
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        ElMessage({
          message: '复制成功',
          type: 'success',
        })
      })
      .catch(err => {
        console.error('复制失败: ', err)
        ElMessage({
          message: '复制失败',
          type: 'error',
        })
      })
  } else {
    // 退回到 document.execCommand('copy') 的方法
    const inputEle = document.createElement('input')
    inputEle.value = text
    document.body.appendChild(inputEle)
    inputEle.select()
    try {
      const successful = document.execCommand('copy')
      const msg = successful ? '复制成功' : '复制失败'
      ElMessage({
        message: msg,
        type: successful ? 'success' : 'error',
      })
    } catch (err) {
      console.error('复制失败: ', err)
      ElMessage({
        message: '复制失败',
        type: 'error',
      })
    }
    inputEle.remove()
  }
}

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
const userStore = useUserStore()
function loginHandle() {
  loading.value = true
  const { userInfo } = userStore;
  const googlecode = first.value + second.value + third.value + fourth.value + fifth.value + sixth.value
  bindGoogleCode({ googlesecret: qrcode.value, googlecode })
    .then(res => {
      ElMessage({
        message: '绑定成功',
        type: 'success',
      })
      if (userInfo.expired) {
        router.replace('/changePassword')
      } else {
        router.replace('/dashboard')
      }
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style lang="scss" scoped>
.tip_word {
  font-family: 'Poppins';
  font-size: 14px;
  margin-bottom: 11px;
}

.el-form-item {

  // margin-bottom: 28px;
  :deep(.el-input__prefix-inner) {
    color: #165DFF;
  }
}

.form-center {
  text-align: center;
  // margin-bottom: 28px;
  font-family: 'Roboto';
  font-weight: 400;
  font-size: 16px;
}

.form-text {
  font-family: 'Poppins';
  font-size: 14px;
  line-height: 1.5;
  color: #bfbfbf;
  text-align: left;
  margin-bottom: 28px;
}

.suffix {
  color: #165DFF;
  margin-right: 15px;
  cursor: pointer;
}

.input-items {
  margin-bottom: 50px;

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
