<template>
   <el-dialog :close-on-click-modal="false" width="690" class="reset-el-styte" :title="(!props.data || !props.data.id) ? '新增' : '修改'" v-model="show"
    :append-to-body="true" @close="emit('close', false)">
    <div class="w-full flex flex-nowrap justify-between">
      <div class="w-7/12">
        <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm" v-loading="loading">
          <el-form-item label="名称" required prop="name">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="代码" prop="symbol">
            <el-input v-model="form.symbol" disabled autocomplete="off" />
          </el-form-item>
          <div class="flex">
            <el-form-item label="最小变化价位" required class="mr-2 w-1/2" prop="pip">
              <el-input v-model="form.pip" autocomplete="off" @focus="setFocus('priceMath')"
                @blur="celarFocus" />
            </el-form-item>
            <el-form-item label="最小变化价位的点值" required class="w-1/2" prop="pip_value">
              <el-input v-model="form.pip_value"  autocomplete="off" />
            </el-form-item>
          </div>
          <div class="flex">
            <el-form-item label="价格系数" required class="mr-2 w-1/2" prop="price_multiple">
              <el-input v-model="form.price_multiple" :disabled="(props.data && props.data.id)" 
                @focus="setFocus('price')" @blur="celarFocus" autocomplete="off" />
            </el-form-item>
            <el-form-item label="成交量系数" required class="w-1/2" prop="volume_multiple">
              <el-input v-model="form.volume_multiple" :disabled="(props.data && props.data.id)" 
                @focus="setFocus('volume')" @blur="celarFocus" autocomplete="off" />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="w-6/12 ml-5">
        <div>
          <div class="w-full flex table-list p-1" :class="{ fouseName: fouseName == 'price' }">
            <span class="w-6/12">价格</span>
            <span class="text-left w-8/12 status blue">{{ priceMath || 'N/A' }}</span>
          </div>
          <div class="w-full flex table-list p-1" :class="{ fouseName: fouseName == 'volume' }">
            <span class="w-6/12">成交量</span>
            <span class="w-8/12 text-left status blue">{{ volumeMath || 'N/A' }}</span>
          </div>
        </div>
        <h3 class="w-full mt-2 mb-1">盈亏浮动(24H)</h3>
        <div :class="{ fouseName: fouseName == 'priceMath' }">
          <div class="w-full flex table-list p-1" v-for="(item, idx) in configData.lever" :key="idx">
            <span class="w-6/12">{{ item }}X</span>
            <span class="w-8/12 text-left status blue">{{ profitMath(item) }}</span>
          </div>
        </div>

      </div>
    </div>
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
import { apiAdd, apiEdit, apiConfig } from '/@/api/modules/contract'
import { getRealtime } from '/@/api/modules/base.api'
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { ElMessage, dayjs } from 'element-plus'

const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})
const fouseName = ref('');
const ruleForm = ref(null)
const loading = ref(false)
const isLoading = ref(false)
const show = ref(true)
const showGoogle = ref(false)
const configData = ref({ lever: [] })
const realtimeData = ref({})
const setFocus = (name) => {
  fouseName.value = name;
}
const celarFocus = () => {
  fouseName.value = ''
}
const getData = () => {
  apiConfig().then(res => {
    const lever_arr = res.lever.split(',');
    const obj = { ...res };
    obj.lever = lever_arr;
    configData.value = obj;
  })
  getRealtime(form.symbol).then(res => {
    realtimeData.value = res[0];
  })
}
const form = reactive({
  name: '',
  symbol: '',
  pip: null,
  pip_value: 1,
  price_multiple: 1,
  volume_multiple: 1,
  googlecode: '',
})
const profitMath = (lever) => {
  // 价格的change/最小变价位*点值*杠杆
  console.log('====', realtimeData.value.change, form.pip, form.pip_value, lever)
  return (realtimeData.value.change / (form.pip || 1) * (form.pip_value || 0) * lever).toFixed(2)
}
const priceMath = computed(() => {
  // 最新价格（HTTP）* 价格系统
  return realtimeData.value.price * (form.price_multiple || 0)
})
const volumeMath = computed(() => {
  // 最新成交额*成交量系数
  return (realtimeData.value.volume * (form.volume_multiple || 0)).toFixed(2)
})

onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      form[key] = props.data[key]
    }
  }
  getData();
})
const trigger = ['blur', 'change']
const rules = {
  name: [{ required: true, message: '', trigger }],
  symbol: [{ required: true, message: '', trigger }],
  pip: [{ required: true, message: '', trigger }],
  pip_value: [{ required: true, message: '', trigger }],
  price_multiple: [{ required: true, message: '', trigger }],
  volume_multiple: [{ required: true, message: '', trigger }]
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
      showGoogle.value = true;
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
