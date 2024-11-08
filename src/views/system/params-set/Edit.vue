<template>
   <el-dialog :close-on-click-modal="false" class="reset-el-styte" width="500" title="修改" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <el-form :model="form" label-position="top" class="pt-[10px]" :rules="rules" ref="ruleForm">
      <p class="info" v-if=" props.data.remarks">* {{ props.data.remarks }}</p>
      <el-form-item :label="`${props.data.name}`" required prop="value">
        <el-input v-model="form.value" type="textarea" :rows="3"
          :placeholder="`请输入${props.data.code}的值`" />
      </el-form-item>
    </el-form>
    <div class="mt-[20px] text-xs text-[#999] leading-[20px] flex" v-if="props.data.remark">
      <span class="mr-[5px]">*</span>
      <span> {{ props.data.remark }}</span>
    </div>
    <template #footer>
      <div class="p-[10px] pt-[30px]">
        <el-button @click="emit('close', false)" class="w-[98px]" round>取消</el-button>
        <el-button type="primary"  class="w-[98px]" round @click="handleGoogle" :loading="isLoading">确定 </el-button>
      </div>
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
import { hex_md5 } from '/@/utils/md5'

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
