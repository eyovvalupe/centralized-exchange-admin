<template>
   <el-dialog :close-on-click-modal="false" class="reset-el-styte" width="540" title="修改" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <el-form :model="form" label-position="top" :rules="rules" ref="ruleForm">
      <p class="info">{{ props.data.remarks }}</p>
      <el-form-item :label="`${props.data.name}`" required prop="value">
        <el-input v-model="form.value" :autosize="{ minRows: 3, maxRows: 4 }" type="textarea"
          :placeholder="`请输入${props.data.code}的值`" />
      </el-form-item>
    </el-form>
    <div class="txt-tips my-2">{{ props.data.remark }}</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('close', false)">取消</el-button>
        <el-button type="primary" class="default_btn" @click="handleGoogle" :loading="isLoading">确定 </el-button>
      </span>
    </template>
  </el-dialog>
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="emit('close', false)" v-if="showGoogle" />
  </el-dialog>
</template>

<script setup>
import { apiEdit } from '/@/api/modules/system/info.api'
import { generateRandomPassword } from '/@/utils'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const ruleForm = ref(null)
const formLabelWidth = ref(100)
const isLoading = ref(false)
const show = ref(true) // 控制弹窗显示隐藏, 一直显示
const showGoogle = ref(false)
const form = reactive({
  value: '',
  code: '',
})
const trigger = ['blur', 'change']
const rules = {
  value: [{ required: true, message: '', trigger }]
}
onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      form[key] = props.data[key]
    }
  }
  console.log(form, props.data);
})

const emit = defineEmits(['close', 'success'])
const handleGoogle = () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      showGoogle.value = true;
    }
  })
}
// 新增
const handleSubmit = async (googlecode) => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      showGoogle.value = false;
      form.googlecode = googlecode;
      submit()
    }
  })
}

const submit = async () => {
  // 发送请求
  isLoading.value = true
  try {
    const send = { ...form };
    const result = await apiEdit(send)
    console.log(result)
    ElMessage({
      type: 'tips',
      message: '修改成功',
      offset: 200
    })
    isLoading.value = false
    emit('close', { reload: true })
  } catch (error) {
    isLoading.value = false
  }
}
</script>
