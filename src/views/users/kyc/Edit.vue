<template>
   <el-dialog :close-on-click-modal="false" width="420" class="reset-el-styte" title="认证审核" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm">
      <el-form-item label="审核" required :label-width="formLabelWidth" prop="status">
        <el-select v-model="form.status" class="w-full">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="拒绝原因" v-if="form.status == 'failure'" :label-width="formLabelWidth" prop="remarks">
        <el-input v-model="form.remarks" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
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
import { apiEdit } from '/@/api/modules/business/kyc.api'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  info: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const ruleForm = ref(null)

const formLabelWidth = ref(100)
const isLoading = ref(false)
// 审核中  [ none ]
// 成功  [ success ]
// 失败  [ failure ]
const show = ref(true)
const statusOptions = [
  {
    value: 'review',
    label: '审核中',
  },
  {
    value: 'success',
    label: '通过',
  },
  {
    value: 'failure',
    label: '拒绝',
  },
]

const form = reactive({
  id: '',
  remarks: '',
  status: ''
})
onMounted(() => {
  for (const key in form) {
    if (props.info && props.info[key] !== undefined) {
      form[key] = props.info[key]
    }
  }
  console.log(form, props.info);
})
const trigger = ['blur', 'change']
const rules = {
  status: [{ required: true, message: '', trigger }]
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
