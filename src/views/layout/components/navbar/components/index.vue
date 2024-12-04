<template>
<el-dialog :close-on-click-modal="false" width="500" class="reset-el-styte" title="绑定谷歌验证器" v-model="show" :append-to-body="true" @close="emit( 'close', false )"
>
  <div v-if="googlebind">
    <div class="status-info py-[30px]">
        <div class="status-info__icon">
            <img src="/@/assets/images/success.svg" />
        </div>
        <div class="status-info__title pt-[10px]">已绑定</div>
        <div class="status-info__desc">如果您有任何问题可联系在线客服</div>
      </div>
  </div>
  <el-form ref="ruleForm" :rules="rules" label-position="top" v-else :model="formState" v-loading="loadingPage" status-icon
    class="login-ruleForm pt-[10px]">
    <div class="qrcode-box">
      <qrcode-vue :value="link" :size="142" level="H" />
    </div>
    <div class="form-center">谷歌密钥</div>
    <el-form-item>
      <el-input readonly v-model="qrcode" class="h50">
        <template #suffix>
          <div class="suffix" @click="copy">
            <span>Copy</span>
          </div>
        </template>
      </el-input>
    </el-form-item>
    <div class="form-center">谷歌验证码</div>

    <el-form-item class="input-items" prop="">
      <el-input type="text" ref="int1" maxlength="1" v-model="first" @input="firstChange" />
      <el-input type="text" ref="int2" maxlength="1" v-model="second" @input="secondChange" />
      <el-input type="text" ref="int3" maxlength="1" v-model="third" @input="thirdChange" />
      <el-input type="text" ref="int4" maxlength="1" v-model="fourth" @input="fourthChange" />
      <el-input type="text" ref="int5" maxlength="1" v-model="fifth" @input="fifthChange" />
      <el-input type="text" ref="int6" maxlength="1" v-model="sixth" @input="sixthChange" />
    </el-form-item>
    <div class="pt-[20px] py-[10px]">
      <el-button :loading="loading" type="primary" class="bind-btn" @click.prevent="loginHandle">
        绑定
      </el-button>
    </div>
  </el-form>
</el-dialog>
</template>

<script setup>
import { ElMessage, ElNotification } from 'element-plus'
import { ref, reactive, computed, defineEmits } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { getGoogleCode, bindGoogleCode } from '/@/api/modules/login.api'
import { useRouter } from 'vue-router'
import { useUserStore } from '/@/store'
const router = useRouter()
const ruleForm = ref()
const formState = reactive({})
const loadingPage = ref(true)
const loading = ref(false)
const show = ref( false ) // 控制弹窗显示隐藏, 一直显示
const props = defineProps({
  googleDialogShow: {
    type: Boolean,
    default: false,
  },
})

const userStore = useUserStore()

const googlebind = computed(() => userStore.userInfo.googlebind)

function open() {
  show.value = true
  if(!googlebind.value){
    getGoogleCode().then(res => {
      link.value = res.googlesecretqr
      qrcode.value = res.googlesecret
      
    }).finally(() => {
      loadingPage.value = false;
    })
  }
}
const rules = ref({
  // first: [
  //   {
  //     required: true,
  //     message: '不为空',
  //     trigger: 'blur',
  //   }
  // ],
  // loginPwd: [
  //   {
  //     required: true,
  //     message: '请输入密码'
  //   }
  // ],
  // captcha: [
  //   {
  //     required: true,
  //     message: '请输入验证码'
  //   }
  // ]
})


const googleDialogShow = computed({
  get: () => props.dialogShow,
  set: val => emit('close', val),
})
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
function loginHandle() {
  // ruleForm.value.validate((valid, fields) => {
  //   if (valid) {
  //     console.log('submit!')
  //   } else {
  //     console.log('error submit!', fields)
  //   }
  // })
  // return
  if(!first.value || !second.value || !third.value || !fourth.value || !fifth.value || !sixth.value){
    ElMessage({
      message: '请输入完整谷歌验证码',
      type: 'error',
    })
    return
  }
  loading.value = true
  const { userInfo } = userStore;
  const googlecode = first.value + second.value + third.value + fourth.value + fifth.value + sixth.value
  bindGoogleCode({ googlesecret: qrcode.value, googlecode })
    .then(res => {
      ElMessage({
        message: '绑定成功',
        type: 'success',
      })
      show.value = false
      userStore.userInfo.googlebind = true
    })
    .finally(() => {
      loading.value = false
    })
}
defineExpose({
  open
})
const emit = defineEmits( ['close', 'success'] )

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
  font-weight: 400;
  font-size: 16px;
  color:#000;
  line-height: 22px;
  margin-top: 20px;
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

.suffix {
  color: #fff;
  cursor: pointer;
  background-color: #4377FE;
  width: 60px;
  border-radius: 0 8px 8px 0;
  position: relative;
  right:-14px;
  font-size: 14px;
}

.qrcode-box{
  border: 1px solid var(--el-color-primary);
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.input-items {
  display: flex;
  margin-left: -10px;
  .el-input{
    flex: 1;
    margin-left: 10px;
  }
  :deep(.el-form-item__content) {
    display: flex;
    justify-content: space-between;

    .el-input {
      width: 100%;
      height: 46px;
      background-color: #fff;
      box-sizing: border-box;

      .el-input__inner {
        text-align: center;
      }
    }
  }
}
.bind-btn{
  width: 100%;
  height:48px !important;
  font-size:16px;
  border-radius:40px;
}
</style>
