<template>
   <el-dialog :close-on-click-modal="false" width="700" class="reset-el-styte" title="新增锁定单" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <div class="flex py-[10px]">
      <div class="w-6/12">
        <el-form :model="form" label-position="top" :rules="rules" ref="ruleForm" v-loading="loading">
          <el-form-item label="用户UID" required prop="uid">
            <el-input-number :min="0" class="input-number" :precision="0" :controls="false" v-model="form.uid" @blur="getBalance" />
          </el-form-item>
          <el-form-item label="大宗商品" required prop="symbol">
            
            <div class="relative w-full">
              <div class="absolute w-full h-full left-0 top-0 z-10 cursor-pointer" @click="showStockSelection=true;"></div>
              <el-input v-model="form.name" placeholder="点击选择大宗商品"  />
            </div>
            
            <!-- <el-select v-model="form.symbol" filterable clearable remote reserve-keyword placeholder="代码模糊搜索"
              remote-show-suffix :remote-method="remoteMethod" @change="symbolChange" :loading="loadingSelect">
              <el-option v-for="item in options" :key="item.symbol" :label="item.symbol" :value="item.symbol">
                <div class="select-opt my-1">
                  <div class="status blue w-full">{{ item.symbol || '--' }}</div>
                  <small class="color"> {{ item.name || '--' }} </small>
                </div>
              </el-option>
            </el-select> -->
          </el-form-item>
          <div class="flex justify-between ml-[-10px]">
            <el-form-item label="开仓方向" required prop="offset"  class="w-0 flex-1 ml-[10px]">
              <el-select v-model="form.offset" class="w-full" placeholder="">
                <el-option label="买涨" value="long" />
                <el-option label="买跌" value="short" />
              </el-select>
            </el-form-item>
            <el-form-item label="杠杆类型" required prop="lever_type"  class="w-0 flex-1 ml-[10px]">
              <el-select v-model="form.lever_type" class="w-full" placeholder="">
                <el-option label="全仓" value="cross" />
                <el-option label="逐仓" value="isolated" />
              </el-select>
            </el-form-item>
            <el-form-item label="杠杆" required prop="lever"  class="w-0 flex-1 ml-[10px]">
              <el-input-number :controls="false" class="input-number" :precision="0" :min="1" v-model="form.lever" />
            </el-form-item>
          </div>
          <el-form-item label="开仓张数" required prop="volume">
            <el-input-number :controls="false" class="input-number" :precision="0" :min="1" v-model="form.volume" />
          </el-form-item>
        </el-form>
      </div>
      <div class="w-6/12 pl-[20px] right-box" :class="{ showcolor: showErrClass }">
        <div>
          <h2 class="mb-2">锁定单确认</h2>
          <div class="table-list-order flex flex-nowrap justify-between">
            <span class="table-span-left">保证金</span>
            <span class="table-span-right"><span class=" status blue">{{ marginBalance || '--' }}</span></span>
          </div>
          <div class="table-list-order flex flex-nowrap justify-between">
            <span class="table-span-left">账户余额</span>
            <span class="table-span-right status blue"><span class=" status blue">{{ stockBalance || '--' }}</span></span>
          </div>
          <div class="table-list-order flex flex-nowrap justify-between">
            <span class="table-span-left">锁定差额</span>
            <span class="table-span-right"><span class="status" :class="diffBalance <= 0 ? 'fail' : ''">{{ diffBalance }}</span></span>
          </div>
        </div>
       
        <div class="mt-[10px] status error text-xs" v-if="diffBalance <= 0">
          * 锁定差额小于或等于0，无效订单
        </div>
      </div>
    </div>
    <template #footer>
      <div class="pb-[10px] pr-[10px]">
        <el-button size="large" class="w-[98px]" @click="emit('close', false)" round>取消</el-button>
        <el-button size="large" type="primary" class="w-[98px]" round @click="handleSubmit" :loading="isLoading">确定 </el-button>
      </div>
    </template>
  </el-dialog>

  <safeword v-model="showPwd" @submit="submit" />

  <StockSelection @choice="onChoice" market-type="blocktrade" @close="showStockSelection=false" v-if="showStockSelection" />

</template>

<script setup>
import { blocktradeLock } from '/@/api/modules/blocktrade'
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { apiWalletBalance } from '/@/api/modules/business/player.api'
import { getSessionToken, symbolBasic, searchMarket } from '/@/api/modules/base.api'
import safeword from '/@/components/safeword'
import StockSelection from '/@/components/stockSelection/index.vue'

const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const showStockSelection = ref(false)

const ruleForm = ref(null)
const loading = ref(false)
const isLoading = ref(false)
const loadingSelect = ref(false)
const showPwd = ref(false)
const show = ref(true)
const options = ref([])
const symbolInfo = ref();
const form = reactive({
  uid: null,
  symbol: undefined,
  name:null,
  offset: 'long',
  volume: '',
  lever_type: 'cross',
  token: '',
  lever: 1
})
const showErrClass = ref(false);
const stockBalance = ref(0);
const disabledCheck = computed(() => {
  return diffBalance.value <= 0 || !stockBalance.value || !marginBalance.value
})
const getBalance = () => {
  if(form.uid == 0){
    form.uid = ''
  }
  if (!form.uid || form.uid.toString().length <= 7) {
    
    stockBalance.value = ''
    return
  }
  apiWalletBalance({ 
    uid: form.uid,
    account:"blocktrade"
  }).then(res => {
    const obj = res.find(f => f.account === 'blocktrade') || { amount: 0 };
    stockBalance.value = Number(obj.amount).toFixed(2);
  })
}
// 保证金：取到股票价格*数量/杠杆
// 账户余额，取钱包的 股票账户(卢布)  [ stock ]
// 锁定差额：保证金-账户余额
const symbolChange = () => {
  if (form.symbol) {
    symbolBasic({ symbol: form.symbol }).then(res => {
      symbolInfo.value = res;
    })
  } else {
    symbolInfo.value = null
  }
}

const onChoice = (item)=>{
  form.symbol = item.symbol
  form.name = item.name
  symbolChange()
}


const marginBalance = computed(() => {
  let strNum;
  if (!symbolInfo.value || isNaN(symbolInfo.value.price) || isNaN(stockBalance.value)) {
    strNum = null
  } else {
    strNum = Math.ceil(symbolInfo.value.price * (form.volume || 1) / (form.lever || 1)).toFixed(2);
  }
  return strNum
})
const diffBalance = computed(() => {
  let strNum = '';
  if (isNaN(marginBalance.value) || isNaN(stockBalance.value)) {
    strNum = null
  } else {
    strNum = Math.ceil(marginBalance.value - stockBalance.value).toFixed(2);
  }
  return strNum;
})
onMounted(() => {
  nextTick(() => {
  })
})
const trigger = ['blur', 'change']
const rules = {
  uid: [{ required: true, message: '', trigger }],
  symbol: [{ required: true, message: '', trigger }],
  offset: [{ required: true, message: '', trigger }],
  volume: [{ required: true, message: '', trigger }],
  lever: [{ required: true, message: '', trigger }, { type: 'number', min: 1, message: '', trigger }],
  lever_type: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])
// 新增
const handleSubmit = async () => {
  showErrClass.value = false;
  ruleForm.value.validate(valid => {
    if (valid) {
      if (disabledCheck.value) {
        showErrClass.value = true;
        setTimeout(() => {
          showErrClass.value = false;
        }, 1000);
        return
      }
      showPwd.value = true
    }
  })
}

const submit = async (safeword) => {
  
  showPwd.value = false
  // 发送请求
  isLoading.value = true
  try {
    const token = await getSessionToken()
    const send = { ...form, token,safeword };
    const result = await blocktradeLock(send)
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
const remoteMethod = (val) => {
  if (val) {
    loadingSelect.value = true
    searchMarket({ symbol: val.toLocaleUpperCase(), mode: 'right' }).then(res => {
      loadingSelect.value = false
      options.value = res;
    })
  } else {
    options.value = []
  }
}
</script>
<style lang="scss" scoped>
.select-opt {
  padding: 3px;
  height: 30px;
  line-height: 12px;

  small {
    color: #bbb;
  }
}

.showcolor {
  animation: bgChange .2s linear;
}

@keyframes bgChange {
  0% {
    background: rgb(255, 186, 186);
  }

  20% {
    background: rgb(191, 191, 249);
  }

  40% {
    background: rgb(171, 171, 246);
  }

  80% {
    background: rgb(255, 201, 201);
  }

  100% {
    background: rgb(199, 199, 255);
  }
}
</style>
