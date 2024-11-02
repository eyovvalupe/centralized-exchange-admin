<template>
   <div class="form-left mb-2">请输入您的交易密码</div> 
  <el-form>
    <el-form-item class="pwd-inputbox input-items">
     
    <el-input type="password" ref="int1" maxlength="1" v-model="first" @input="firstChange" />
    <el-input type="password" ref="int2" maxlength="1" v-model="second" @input="secondChange" />
    <el-input type="password" ref="int3" maxlength="1" v-model="third" @input="thirdChange" />
    <el-input type="password" ref="int4" maxlength="1" v-model="fourth" @input="fourthChange" />
    <el-input type="password" ref="int5" maxlength="1" v-model="fifth" @input="fifthChange" />
    <el-input type="password" ref="int6" maxlength="1" v-model="sixth" @input="sixthChange" />
  </el-form-item>
  <el-form-item  style="margin-bottom: 14px">
      <div style="width: 100%; text-align: center;">
        <el-button
        class="google-submit w-9/12"
        :loading="loading"
        :disabled="disabledLogin"
        type="primary"
        @click.prevent="loginHandle"
      >
      验证
      </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, computed } from 'vue'
const emit = defineEmits(["update:modelValue", 'change']);
const props = defineProps({
  modelValue: String,
  default : '',
});
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
const disabledLogin = computed(() => {
  const isDone = (first.value.length === 1 &&
    second.value.length === 1 &&
    third.value.length === 1 &&
    fourth.value.length === 1 &&
    fifth.value.length === 1 &&
    sixth.value.length === 1);
  let val = first.value + second.value + third.value + fourth.value + fifth.value + sixth.value;
  emit("change", { val, isDone });
  emit("update:modelValue", val);
  return isDone
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
}

.suffix {
  color: #165DFF;
  margin-right: 15px;
  cursor: pointer;
}

.pwd-inputbox {
  margin-bottom: 10px;
  width: 100%;

}
.input-items {
  margin-bottom: 20px;
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
