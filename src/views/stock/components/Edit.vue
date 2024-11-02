<template>
   <el-dialog :close-on-click-modal="false" width="500" class="reset-el-styte" title="修改" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <el-form class="pt-[10px]" :model="form" label-position="top" :rules="rules" ref="ruleForm" v-loading="loading">
      <el-form-item label="公司名称" required prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="状态" required prop="enabled">
        <el-select v-model="form.enabled" class="w-full" placeholder="请选择状态">
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
    
    </el-form>
    <template #footer>
      <div class="p-[10px]">
        <el-button  round class="w-[98px]" @click="emit('close', false)">取消</el-button>
        <el-button type="primary"  round class="w-[98px]" @click="handleGoogle" :loading="isLoading">确定 </el-button>
      </div>
    </template>
  </el-dialog>
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="emit('close', false)" v-if="showGoogle" />
  </el-dialog>
</template>

<script setup>
import { apiUpdate } from  '/@/api/modules/stock/index.api'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const ruleForm = ref(null)
const showGoogle = ref(false)
const loading = ref(false)
const isLoading = ref(false)
const show = ref(true)

const form = reactive({
  symbol: '',
  name: '',
  enabled: ''
})
onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      form[key] = props.data[key]
    }
  }
})
const trigger = ['blur', 'change']

const rules = {
  status: [{ required: true, message: '', trigger }],
  safeword: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])

const handleSubmit = async (googlecode) => {
  isLoading.value = true
  showGoogle.value = false
  try {
    const send = { ...form,googlecode };
    const result = await apiUpdate(send)
    ElMessage({
      type: 'tips',
      message:'修改成功',
      offset: 200
    })
    isLoading.value = false
    emit('close', { reload: true })
  } catch (error) {
    isLoading.value = false
  }
}

const handleGoogle = () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      showGoogle.value = true;
    }
  })
}
</script>
