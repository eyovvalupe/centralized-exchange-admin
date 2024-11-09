<template>
   <el-dialog :close-on-click-modal="false" width="500" class="reset-el-styte" :title="(!props.data || !props.data.id) ? '新增' : '修改'" v-model="show"
    :append-to-body="true" @close="emit('close', false)">
    <el-form :model="form" :rules="rules" class="pt-[10px]" label-position="top" ref="ruleForm" v-loading="loading">
      <div class="flex">
        <el-form-item label="时间" required class="mr-[10px] w-1/2" prop="time">
          <el-input-number class="input-number" :min="1" :precision="0" :controls="false" v-model="form.time"  autocomplete="off" />
        </el-form-item>
        <el-form-item label="时间单位" required class="w-1/2" prop="unit">
          <el-select v-model="form.unit" class="w-full">
            <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="盈亏范围(%)" required  prop="rangereturn">
          <el-input v-model="form.rangereturn" autocomplete="off" />
          <small class="text-gray-400 pt-[10px]">* 逗号隔开，盈亏在两个数值之间浮动</small>
        </el-form-item>
    </el-form>
    <template #footer>
      <div class="p-[10px]">
        <el-button @click="emit('close', false)"  round class="w-[98px]">取消</el-button>
        <el-button type="primary" round class="w-[98px]" @click="handleGoogle" :loading="isLoading">确定 </el-button>
      </div>
    </template>
  </el-dialog>
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320" :append-to-body="true">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="emit('close', false)" v-if="showGoogle" />
  </el-dialog>
</template>

<script setup>
import { apiAdd, apiEdit } from '/@/api/modules/time'
import { ref, reactive, onMounted} from 'vue'
import { ElMessage } from 'element-plus'

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

const options = [
  { value : 's', label : '秒' },
  { value : 'm', label : '分钟' },
  { value : 'h', label : '小时' },
  { value : 'd', label : '天' }
]
const form = reactive({
  rangereturn: '',
  time: 1,
  unit: 's',
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
  rangereturn: [{ required: true, message: '', trigger }],
  time: [{ required: true, message: '', trigger }],
  unit: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])
// 新增
const handleSubmit = async (googlecode) => {
  // 发送请求
  const api = (!props.data || !props.data.id) ? apiAdd : apiEdit
  isLoading.value = true
  showGoogle.value = false
  try {
    const send = { ...form, googlecode };
    if (props.data && props.data.id) {
      send.id = props.data.id;
    }
    const result = await api(send)
    ElMessage({
      type: 'tips',
      message: !props.data ? '新增成功' : '修改成功',
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
      let haserr=''
      if (form.rangereturn.indexOf(',') === -1) {
        haserr = '盈亏范围多个“,”隔开';
      }
      if (haserr) {
        ElMessage({
          message: haserr,
          offset: 200,
          type: 'tips'
        })
        return
      }
      showGoogle.value = true;
    }
  })
}
</script>
