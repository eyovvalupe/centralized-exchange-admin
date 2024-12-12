<template>
   <el-dialog :close-on-click-modal="false" width="500" class="reset-el-styte" title="调整价格" v-model="show" :append-to-body="true"
    style="left: 50%;margin-left: 0;"
    @close="emit('close', false)">
    <div class="stock-popup">
      <MarketInfo type="constract" :symbol="data.symbol" v-if="data.symbol" /> 
    </div>
    <div class="pt-[10px]" v-loading="loading">
        <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm">
          <el-form-item label="名称">
            <div class="el-input el-input--large">
              <div class="el-input__wrapper symbol-info">
                <div class="name">{{form.name}}</div>
                <div class="symbol">{{ form.symbol }}</div>
              </div>
            </div>
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
            <div class="time_list">
              <div class="time_item" v-for="item in  timeOptions" :key="item.value" @click="form.second=item.value">{{ item.label }}</div>
            </div>
            <div class="color-[#666]">0为即时生效</div>
          </el-form-item>
        </el-form>
      
    </div>
    <div class="right-box">
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
            <span style="width:40%;font-weight: normal;" class="text-right">未生效调整</span>
            <span style="width:60%;" class="text-left status blue">{{ formRight.unadjusted }}</span>
          </div>
          <div class="table-list flex flex-nowrap justify-between">
            <span style="width:40%;font-weight: normal;" class="text-right">生效时间</span>
            <span style="width:60%;" class="text-left status blue">{{ formRight.second }}秒</span>
          </div>
          <div class="table-list flex flex-nowrap justify-between">
            <span style="width:40%;font-weight: normal;" class="text-right">未生效百分比</span>
            <span style="width:60%;" class="text-left status blue">{{ percentMath }}%</span>
          </div>
        </div>
    </div>
    <template #footer>
      <div  class="pb-[10px] pr-[10px] pt-[30px]">
        <el-button @click="emit('close', false)" class="w-[98px]" round>取消</el-button>
        <el-button type="primary" class="w-[98px]" round @click="handleSubmit" :loading="isLoading">确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { apiAdjustg, apiDetial } from '/@/api/modules/contract'
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, dayjs } from 'element-plus'
import { useSocketStore } from '/@/store'
import MarketInfo from '../../../components/market/MarketInfo.vue'
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

const timeOptions = ref([
  {
    label:'1分钟',
    value:60
  },
  {
    label:'3分钟',
    value:180
  },
  {
    label:'10分钟',
    value:600
  },
  {
    label:'1小时',
    value:3600
  },
  {
    label:'6小时',
    value:6 * 3600
  },
  {
    label:'24小时',
    value:24 * 3600
  }
])

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

<style lang="scss" scoped>
.symbol-info{
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  align-items: flex-start;
  justify-content: center;
  .name{
    font-size: 14px;
    color:#000;
  }
  .symbol{
    color:#999;
  }

}

.stock-popup{
  position: absolute;
  left:-510px;
  width: 500px;
  background-color: #fff;
  height: 100%;
  top:0;
  border-radius: var(--el-dialog-border-radius);
}

.time_list{
  display: flex;
  gap:14px;
  margin-top: 10px;
}
.time_item{
  width: 65px;
  height: 32px;
  line-height: 30px;
  border:1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  color:#666;
  cursor: pointer;
  transition: .3s;
  &:hover{
    background-color: #4377FE;
    color:#fff;
    border-color: #4377FE;
  }
}
</style>
