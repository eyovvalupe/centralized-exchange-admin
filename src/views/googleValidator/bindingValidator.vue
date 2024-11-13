<template>
  <el-form ref="ruleForm" label-position="top" :model="formState"  status-icon
    class="login-ruleForm">
    <div class="flex items-center justify-center py-[24px]">
      <qrcode-vue :value="link" :size="138" level="H" />
    </div>
    <div class="form-center">谷歌验证器密钥</div>
    <el-form-item>
      <el-input readonly v-model="qrcode" class="login-input">
        <template #suffix>
          <div class="copy-btn" @click="copy">
            <span>copy</span>
          </div>
        </template>
      </el-input>
 
    </el-form-item>
    <div class="tips">
      1、在您的手机上安装「Google Authentication」
    </div>
    <div class="tips pt-[10px]">
      2、扫码或手动输入<span class="!text-[#EF8401]">谷歌验证器秘钥</span>，完成“添加”
    </div>
    
    <div class="form-center pt-[20px]">谷歌验证码</div>

    <el-form-item class="input-items">
      <el-input type="text" ref="int1" maxlength="1" v-model="first" @input="firstChange" />
      <el-input type="text" ref="int2" maxlength="1" v-model="second" @input="secondChange" />
      <el-input type="text" ref="int3" maxlength="1" v-model="third" @input="thirdChange" />
      <el-input type="text" ref="int4" maxlength="1" v-model="fourth" @input="fourthChange" />
      <el-input type="text" ref="int5" maxlength="1" v-model="fifth" @input="fifthChange" />
      <el-input type="text" ref="int6" maxlength="1" v-model="sixth" @input="sixthChange" />
    </el-form-item>

  
    <div class="pt-[20px]">
      <el-button :loading="loading" type="primary" class="login-btn" @click.prevent="loginHandle">
        确认
      </el-button>
      
    </div>
    <div class="pt-[20px]">
      <el-button @click="goSkipPage" type="primary" class="login-btn" plain>暂时跳过</el-button>
    </div>
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
const goSkipPage=()=>{
  router.push('/dashboard')
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
  color:#000;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 10px;
}

.form-text {
  font-family: 'Poppins';
  font-size: 14px;
  line-height: 1.5;
  color: #bfbfbf;
  text-align: left;
  margin-bottom: 28px;
}

.copy-btn {
  color: #fff;
  background-color: #165DFF;
  width: 70px;
  cursor: pointer;
  position: relative;
  height: 48px;
  line-height: 48px;
  right: -15px;
  border-radius: 0 8px 8px 0;
}
.input-items {
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
.tips{
  line-height: 20px;
  color:#666;
  font-size: 14px;
  span{
    color:#666;
  }
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
:deep(.el-button.is-plain){
  background: none;
}

</style>
