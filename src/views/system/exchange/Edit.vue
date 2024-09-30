<template>
   <el-dialog :close-on-click-modal="false" width="420" class="reset-el-styte" title="汇率价格设置" v-model="show" :append-to-body="true" @close="emit('close', false)">
    <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm">
      <el-form-item label="市场" :label-width="formLabelWidth">
        <el-input  v-model="form.market" disabled />
      </el-form-item>
      <el-form-item label="币种" :label-width="formLabelWidth">
        <el-input  v-model="form.symbol" disabled/>
      </el-form-item>
      <el-form-item label="汇率" :label-width="formLabelWidth" prop="price">
        <el-input  v-model="form.price"  />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('close', false)">取消</el-button>
        <el-button type="primary" class="default_btn" @click="handleGoogle" :loading="isLoading">确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { apiEdit } from '/@/api/modules/exchange'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  info: { // 行数据
    type: Object,
    default: () => ({})
  }
})
const ruleForm = ref(null)
const isLoading = ref(false)
const show = ref(true)
const form = reactive({
  id: '',
  symbol: '',
  price: '',
  market: ''
})
onMounted(() => {
  for (const key in form) {
    if (props.info && props.info[key] !== undefined) {
      form[key] = props.info[key]
    }
  }
})
const trigger = ['blur', 'change']
const rules = {
  price: [{ required: true, message: '', trigger }]
}
const emit = defineEmits(['close', 'success'])
const handleGoogle = () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      submit()
    }
  })
}

const submit = async () => {
  // 发送请求
  isLoading.value = true
  try {
    const result = await apiEdit(form)
    console.log(result)
    ElMessage({
      type: 'tips',
      message: '操作成功',
      offset: 200
    })
    isLoading.value = false
    emit('close', { reload: true })
  } catch (error) {
    isLoading.value = false
  }
}
</script>
