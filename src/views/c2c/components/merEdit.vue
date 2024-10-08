<template>
   <el-dialog :close-on-click-modal="false" width="480" class="reset-el-styte" :title="(!props.data || !props.data.id) ? '新增' : '修改'" v-model="show"
    :append-to-body="true" @close="emit('close', false)">
    <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm" v-loading="loading">
      <el-form-item label="商户名称" required prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <div class="flex w-full">
        <el-form-item label="成交量" required class="w-4/12" prop="volume">
          <el-input v-model="form.volume" />
        </el-form-item>
        <el-form-item label="成交率" required class="mx-2 w-4/12" prop="volumerate">
          <el-input v-model="form.volumerate" />
        </el-form-item>
        <el-form-item label="平均时效(分钟)" required class="w-4/12" prop="avetime">
          <el-input v-model="form.avetime" />
        </el-form-item>
      </div>
    </el-form>
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
import { apiAdd, apiEdit, apiDetial } from '/@/api/modules/c2cMer'
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { ElMessage, dayjs } from 'element-plus'

const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const ruleForm = ref(null)
const loading = ref(false)
const isLoading = ref(false)
const show = ref(true)
const showGoogle = ref(false)

const form = reactive({
  name: '',
  volumerate: '',
  volume: '',
  avetime: '',
})
onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      form[key] = props.data[key]
    }
  }
  if (props.data && props.data.id) {
    apiDetial({ id: props.data.id }).then(res => {
      for (const key in res) {
        form[key] = res[key]
      }
    })
  }
})
const trigger = ['blur', 'change']
const rules = {
  name: [{ required: true, message: '', trigger }],
  avetime: [{ required: true, message: '', trigger }],
  volumerate: [{ required: true, message: '', trigger }],
  volume: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])
// 新增
const handleSubmit = async () => {
  // 发送请求
  const api = (props.data && props.data.id) ? apiEdit : apiAdd;
  isLoading.value = true
  showGoogle.value = false
  try {
    const send = { ...form };
    if (form.starttime) {
      send.starttime = dayjs(form.starttime).format('YYYY-MM-DD')
    }
    await api(send)
    ElMessage({
      type: 'tips',
      message: !props.data || !props.data.id ? '新增成功' : '修改成功',
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
      handleSubmit()
    }
  })
}
</script>
<style scoped>
.fouseName {
  animation: bgcolor .3s linear forwards;
}

@keyframes bgcolor {
  0% {
    background: rgb(255, 174, 174);
  }

  30% {
    background: #e5f2ff;
  }

  50% {
    background: rgb(255, 174, 174);
  }

  100% {
    background: #e5f2ff;
  }
}
</style>
