<template>
   <el-dialog :close-on-click-modal="false" width="640" class="reset-el-styte" title="调整成交量" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <div class="flex justify-between" v-loading="loading">
      <div class="w-7/12">
        <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm">
          <el-form-item label="名称">
            <el-input v-model="form.name" disabled autocomplete="off" />
          </el-form-item>
          <el-form-item label="代码">
            <el-input v-model="form.symbol" disabled autocomplete="off" />
          </el-form-item>
          <el-form-item label="成交量系数" required prop="volume_multiple">
            <el-input-number v-model="form.volume_multiple" @blur="form.volume_multiple <= 0 ? form.volume_multiple = '' : ''" :min="0" :controls="false" class="input-number" autocomplete="off" />
          </el-form-item>
        </el-form>
      </div>
      <div class="w-5/12 ml-4 right-box">
        <div class="mt-7">
          <div class="table-list p-2">
            <label>原成交额(调整前) </label><br>
            <p class="leading-[22px] status blue">{{ oldAmountMath || 'N/A' }}</p>
          </div>
          <div class="table-list p-2">
            <label>最新成交额(调整后)</label> <br>
            <p class="leading-[22px] status blue">{{ amountMath || 'N/A' }}</p>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div  class="pb-[10px] pr-[10px]">
        <el-button @click="emit('close', false)" round class="w-[98px]">取消</el-button>
        <el-button type="primary"  class="w-[98px]" round @click="handleSubmit" :loading="isLoading">确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { apiVolume, apiDetial } from '/@/api/modules/blocktrade'
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, dayjs } from 'element-plus'
import { useSocketStore } from '/@/store'
const socketStore = useSocketStore()

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
let volume_multiple = 0;
const form = ref({
  name: '',
  symbol: '',
  volume_multiple: '',
})

const getData = () => {
  loading.value = true;
  apiDetial({ symbol: props.data.symbol }).then(res => {
    form.value = res;
    volume_multiple = res.volume_multiple;
  }).finally(() => {
    loading.value = false
  })
}
getData();

onUnmounted(() => {
  socketStore.send('realtime', '')
})

const validateVol = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(''))
  } else if (value <= 0) {
    callback(new Error("成交量系数需大于0"))
  } else {
    callback()
  }
}

const trigger = ['blur', 'change']
const rules = {
  volume_multiple: [{ required: true, message: '', trigger,validator:validateVol }]
}

const emit = defineEmits(['close', 'success'])
// 新增
const handleSubmit = async () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      isLoading.value = true
      try {
        const { symbol, volume_multiple } = form.value;
        const send = { symbol, volume_multiple: volume_multiple };
        await apiVolume(send)
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
    }else{
      if(form.value.volume_multiple <= 0){
        ElMessage({
          type: 'tips',
          message: '成交量系数需大于0',
          offset: 200
        })
      }
    }
  })
}

const symbol_socket = computed(() => {
  return form.value.symbol ? socketStore.findOne(form.value.symbol) : {}
})
const oldAmountMath = computed(() => {
  const num = (symbol_socket.value.amount || 0) / volume_multiple;
  return !isFinite(num) ? null : Number(num).toFixed(2);
})
const amountMath = computed(() => {
  return ((symbol_socket.value.amount || 0) * (form.value.volume_multiple || 0)).toFixed(2)
})

watch(() => socketStore.sokcetWS, (ws) => {
  if (ws) {
    socketStore.send('realtime', props.data.symbol)
  }
}, { immediate: true })
</script>
