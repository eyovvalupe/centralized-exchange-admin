<template>
  <el-form ref="ruleForm" :model="formState" label-width="0" status-icon class="reset-el-styte">
    <!-- <div class="form-center" style="margin-bottom: 30px">
      <img src="./images/QRcode.png" alt="" />
    </div>

    <p class="tip_word">Your secret key</p>
    <el-form-item prop="" style="margin-bottom: 10px">
      <el-input readonly v-model="link" :prefix-icon="Link" class="h50">
        <template #suffix>
          <div class="suffix" @click="copy">
            <span>Copy</span>
          </div>
        </template>
      </el-input>
    </el-form-item>

    <div class="form-text">
      Write down this code, never reveal it to other. You can use it to regain access to your account if there is no
      access to the authenticator.
    </div>

    <div class="form-center" style="margin-bottom: 20px">谷歌验证码</div> -->
    <div class="form-left my-2" v-if="!props.noTitle">请验证你的谷歌验证码</div> 
    <el-form-item class="mt-[10px] flex items-center input-items">
      <el-input class="flex-1" type="text" ref="int1" maxlength="1" v-model="first" @input="firstChange" />
      <el-input class="flex-1" type="text" ref="int2" maxlength="1" v-model="second" @input="secondChange" />
      <el-input class="flex-1" type="text" ref="int3" maxlength="1" v-model="third" @input="thirdChange" />
      <el-input class="flex-1" type="text" ref="int4" maxlength="1" v-model="fourth" @input="fourthChange" />
      <el-input class="flex-1" type="text" ref="int5" maxlength="1" v-model="fifth" @input="fifthChange" />
      <el-input class="flex-1" type="text" ref="int6" maxlength="1" v-model="sixth" @input="sixthChange" />
    </el-form-item>
  </el-form>
  <div class="flex justify-end pt-[20px] reset-el-styte">
      <el-button
        round
        type="primary"
        class="w-[98px]"
        plain
        @click.prevent="emit('close')"
      >
      取消
      </el-button>
      <el-button
        round
        class="w-[98px]"
        :loading="loading"
        type="primary"
        @click.prevent="loginHandle"
      >
      验证
      </el-button>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
const ruleForm = ref()
const formState = reactive( {} )
const loading = ref( false )
const props = defineProps( {
  noTitle : { // 弹窗类型
    type : Boolean,
    default : false
  }
} )
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

const emit = defineEmits( ['confirm','close'] )

// 输入内容自动切换下一个输入框
const first = ref( '' )
const int1 = ref()

const second = ref( '' )
const int2 = ref()

const third = ref( '' )
const int3 = ref()

const fourth = ref( '' )
const int4 = ref()

const fifth = ref( '' )
const int5 = ref()

const sixth = ref( '' )
const int6 = ref()

// 第一个文本框 change 事件
function firstChange( e ) {
  if ( e ) {
    int2.value.focus()
  } else {
    int1.value.focus()
    int2.value.blur()
  }
}
// 第二个文本框 change 事件
function secondChange( e ) {
  if ( e ) {
    int3.value.focus()
  } else {
    int2.value.blur()
    int1.value.focus()
  }
}
// 第三个文本框 change 事件
function thirdChange( e ) {
  if ( e ) {
    int4.value.focus()
  } else {
    int3.value.blur()
    int2.value.focus()
  }
}
// 第四个文本框 change 事件
function fourthChange( e ) {
  if ( e ) {
    int5.value.focus()
  } else {
    int4.value.blur()
    int3.value.focus()
  }
}
// 第五个文本框 change 事件
function fifthChange( e ) {
  if ( e ) {
    int6.value.focus()
  } else {
    int5.value.blur()
    int4.value.focus()
  }
}
// 第六个文本框 change 事件
function sixthChange( e ) {
  if ( e ) {
    int6.value.focus()
  } else {
    int6.value.blur()
    int5.value.focus()
  }
}

function loginHandle() {
  ruleForm.value.validate( valid => {
    if ( valid ) {
      if(disabledLogin.value){
        ElMessage({
          message: '请填写完整',
          offset: 200,
          type: 'tips'
        })
        return
      }
      emit( 'confirm', first.value + second.value + third.value + fourth.value + fifth.value + sixth.value)
    }
  } )
}
onMounted(()=>{
  setTimeout(() => {
    firstChange();
  }, 500);
})
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
.form-left{
  margin: 10px 0 0 0;
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
.google-submit{
  margin: 0 auto;
}

.input-items{
  margin-left: -10px;
}
.input-items .el-input{
  margin-left: 10px;
}
</style>
