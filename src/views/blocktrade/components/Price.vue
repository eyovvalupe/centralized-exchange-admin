<template>
   <el-dialog :close-on-click-modal="false" width="700" class="reset-el-styte" title="调整价格" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <div class="flex justify-between pt-[10px]" v-loading="loading">
      <div class="w-7/12">
        <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm">
          <el-form-item label="名称">
            <el-input v-model="form.name" disabled autocomplete="off" />
          </el-form-item>
          <el-form-item label="代码">
            <el-input v-model="form.symbol" disabled autocomplete="off" />
          </el-form-item>
          <el-form-item label="调整值" required prop="adjust">
            <el-input-number class="input-number" :controls="false" v-model="form.adjust" autocomplete="off" />
            <div>
              <el-button type="success" size="small"  @click="mathBtnPrice(1)">涨1%</el-button>
              <el-button type="success" size="small"  @click="mathBtnPrice(5)">涨5%</el-button>
              <el-button type="success" size="small"  @click="mathBtnPrice(10)">涨10%</el-button>
              <el-button type="danger" size="small" plain @click="mathBtnPrice(-1)">跌1%</el-button>
              <el-button type="danger" size="small" plain @click="mathBtnPrice(-5)">跌5%</el-button>
              <el-button type="danger" size="small" plain @click="mathBtnPrice(-10)">跌10%</el-button>
            </div>
          </el-form-item>
          <el-form-item label="生效时间" required prop="second">
            <div class="flex w-full">
              <el-input-number class="input-number" v-model="form.second" :min="0" :controls="false" placeholder="">
                <template #suffix>秒</template>
              </el-input-number>
            </div>
            <small class="color-[#666] mt-[8px]">0为即时生效</small>
          </el-form-item>
        </el-form>
      </div>
      <div class="w-5/12 ml-4 right-box">
        <!-- <div>
          <h2 class="mb-2">已生效</h2>
          <div class="table-list flex flex-nowrap justify-between">
            <span style="width: 50%;font-weight: normal;" class="text-right">原价格(调整前)</span>
            <span class="w-6/12 text-left status blue">{{ formRight.old_price || 'N/A' }}</span>
          </div>
          <div class="table-list flex flex-nowrap justify-between">
            <span style="width: 50%;font-weight: normal;" class="text-right">最新价格(调整后)</span>
            <span class="w-6/12 text-left status blue">{{ formRight.price || 'N/A' }}</span>
          </div>
        </div> -->
        <div>
          <h2 class="my-2">待生效</h2>
          <div class="table-list flex flex-nowrap justify-between">
            <span style="width: 50%;font-weight: normal;" class="text-right">未生效调整</span>
            <span class="w-6/12 text-left status blue">{{ formRight.unadjusted }}</span>
          </div>
          <div class="table-list flex flex-nowrap justify-between">
            <span style="width: 50%;font-weight: normal;" class="text-right">生效时间</span>
            <span class="w-6/12 text-left status blue">{{ formRight.second }}秒</span>
          </div>
          <div class="table-list flex flex-nowrap justify-between">
            <span style="width: 50%;font-weight: normal;" class="text-right">未生效百分比</span>
            <span class="w-6/12 text-left status blue">{{ percentMath }}%</span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div  class="pb-[10px] pr-[10px]">
        <el-button @click="emit('close', false)" class="w-[98px]" round>取消</el-button>
        <el-button type="primary" class="w-[98px]" round @click="handleSubmit" :loading="isLoading">确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { apiAdjustg, apiDetial } from '/@/api/modules/blocktrade'
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

const form = ref({
  name: '',
  symbol: '',
  adjust: '',
  second: 0,
})
let formRight = { unadjusted: 0 };
const symbol_socket = computed(() => {
  return form.value.symbol ? socketStore.findOne(form.value.symbol) : {}
})
const percentMath = computed(() => {
  return (formRight.unadjusted / (symbol_socket.value.price || 0) * 100).toFixed(2)
})
const getData = () => {
  loading.value = true;
  apiDetial({ symbol: props.data.symbol }).then(res => {
    form.value = { ...res, adjust: '' };
    formRight = { ...res };
  }).finally(() => {
    loading.value = false
  })
}
getData();

onUnmounted(() => {
  socketStore.send('realtime', '')
})

const validateAdjust = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(''))
  } else if (value == 0) {
    callback(new Error("调整值不能为0"))
  } else {
    callback()
  }
}
const trigger = ['blur', 'change']
const rules = {
  second: [{ required: true, message: '', trigger }],
  adjust: [{ required: true, message: '', trigger,validator:validateAdjust }]
}

const emit = defineEmits(['close', 'success'])
// 新增
const handleSubmit = async () => {
  ruleForm.value.validate(async valid => {
    if (valid) {
      
      isLoading.value = true
      try {
        const { symbol, adjust, second } = form.value;
        const send = { symbol, second, adjust };
        await apiAdjustg(send)
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
    }else {
      if(form.value.adjust == '0'){
        ElMessage({
          type: 'tips',
          message: '调整值不能为0',
          offset: 200
        })
      }
    }
  })
}

const mathBtnPrice = (num) => {
  const n = formRight.price * (num / 100);
  form.value.adjust = Number(n).toFixed(12);
}

watch(() => socketStore.sokcetWS, (ws) => {
  if (ws) {
    socketStore.send('realtime', props.data.symbol)
  }
}, { immediate: true })
</script>
