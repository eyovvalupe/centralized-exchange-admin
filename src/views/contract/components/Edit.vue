<template>
   <el-dialog :close-on-click-modal="false" :width="!isEdit ? 700 : 500" class="reset-el-styte" :title="!isEdit ? '新增' : '修改'" v-model="show"
    :append-to-body="true" @close="emit('close', false)">
    <div class="w-full" :class="[!isEdit ? ' flex flex-nowrap justify-between' : '']">
      <div class="pt-[10px]" :class="{'w-7/12':!isEdit}">
        <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm" v-loading="loading">
          <el-form-item label="名称" required prop="name">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="代码" prop="symbol">
            <el-input v-model="form.symbol" disabled autocomplete="off" />
          </el-form-item>
          <div class="flex">
            <el-form-item label="最小变化点差" required class="mr-2 w-1/2" prop="pip">
              <el-input v-model="form.pip" @focus="setFocus('priceMath')"
                @blur="isNaN(form.pip) || form.pip <= 0 ? form.pip = '' : '';celarFocus" />
            </el-form-item>
            <el-form-item label="点值" required class="w-1/2" prop="pip_value">
              <el-input-number class="input-number" @blur="form.pip_value <= 0 ? form.pip_value = '' : '';" :controls="false" v-model="form.pip_value"   />
            </el-form-item>
          </div>
          <div class="flex" v-if="!isEdit">
            <el-form-item label="价格系数" required class="mr-2 w-1/2" prop="price_multiple">
              <el-input-number class="input-number" :controls="false"  v-model="form.price_multiple" 
                @focus="setFocus('price')" @blur="form.price_multiple <= 0 ? form.price_multiple = '' : '';celarFocus"  />
            </el-form-item>
            <el-form-item label="成交量系数" required class="w-1/2" prop="volume_multiple">
              <el-input-number class="input-number" :controls="false" :min="0" v-model="form.volume_multiple" 
                @focus="setFocus('volume')" @blur="form.volume_multiple <= 0 ? form.volume_multiple = '' : '';celarFocus"  />
            </el-form-item>
          </div>
          <el-form-item label="杠杆" required prop="lever">
            <el-tag type="primary" class="mr-[6px] mb-[6px]" size="default" @close="levers.splice(i,1)" v-for="(level,i) in levers" closable :key="level">{{ level }}X</el-tag>
            <div>
              <el-input-number class="mr-[6px] mb-[6px]" style="width:50px;" @blur="levelVal <= 0 ? levelVal='' : ''" v-model="levelVal" size="small" :controls="false" v-if="addLevel" />
              <el-button type="primary" class="mb-[6px]" size="small" v-if="addLevel" @click="saveLevel">保存</el-button>
              <el-button type="primary" class="mb-[6px]" size="small" icon="plus" @click="addLevel = true;" v-else>添加</el-button>
            </div>
            <!-- <el-input v-model="form.lever" placeholder="支持多个，英文逗号隔开" 
              @focus="setFocus('lever')" @blur="celarFocus" autocomplete="off" /> -->
            
          </el-form-item>
        </el-form>
      </div>
      <div class="w-6/12 ml-[20px] mt-[10px]" v-if="!isEdit">
        <div>
          <div class="w-full flex table-list" :class="{ fouseName: fouseName == 'price' }">
            <span class="w-6/12">价格</span>
            <span class="text-left w-8/12 status blue">{{ priceMath || 'N/A' }}</span>
          </div>
          <div class="w-full flex table-list" :class="{ fouseName: fouseName == 'volume' }">
            <span class="w-6/12">成交量</span>
            <span class="w-8/12 text-left status blue">{{ volumeMath || 'N/A' }}</span>
          </div>
        </div>
        <h3 class="w-full mt-[20px] text-xs mb-[10px]" v-if="configData.lever && configData.lever.length">盈亏浮动(24H)</h3>
        <div :class="{ fouseName: fouseName == 'priceMath' }">
          <div class="w-full flex table-list" v-for="(item, idx) in configData.lever" :key="idx">
            <span class="w-6/12">{{ item }}X</span>
            <span class="w-8/12 text-left status blue">{{ profitMath(item) }}</span>
          </div>
        </div>

      </div>
    </div>
    <template #footer>
      <div class="p-[10px]">
        <el-button round @click="emit('close', false)" class="w-[98px]">取消</el-button>
        <el-button round type="primary" class="w-[98px]" @click="handleGoogle" :loading="isLoading">确定 </el-button>
      </div>
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
const isEdit = computed(()=>{
  return props.data && props.data.id ? true : false
})
const addLevel = ref(false)
const levelVal = ref(null)
const levers = ref([])
const fouseName = ref('');
const ruleForm = ref(null)
const loading = ref(false)
const isLoading = ref(false)
const show = ref(true)
const showGoogle = ref(false)
const configData = ref({ lever: [] })
const realtimeData = ref({})

const saveLevel = ()=>{
  if(levelVal.value == null || levelVal.value <= 0){
    return
  }
  if(levers.value.indexOf(levelVal.value) > -1){
    return ElMessage({
          offset: 200,
          message: '杠杆已存在',
          type: 'tips'
      })
  }
  levers.value.push(levelVal.value)
  addLevel.value = false
  levelVal.value = null
}
const setFocus = (name) => {
  fouseName.value = name;
}
const celarFocus = () => {
  fouseName.value = ''
}
const getData = () => {
  apiConfig().then(res => {
    const lever_arr = res.lever ? res.lever.split(',') : [] 
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
  lever:'',
  googlecode: '',
})


const profitMath = (lever) => {
  // 价格的change/最小变价位*点值*杠杆
  return (realtimeData.value.change / (form.pip || 1) * (form.pip_value || 0) * lever).toFixed(2)
}
const priceMath = computed(() => {
  // 最新价格（HTTP）* 价格系统
  return (realtimeData.value.price || 0) * (form.price_multiple || 0)
})
const volumeMath = computed(() => {
  // 最新成交额*成交量系数
  return ((realtimeData.value.volume || 0) * (form.volume_multiple || 0)).toFixed(2)
})

onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      if(key == 'pip'){
        let val = props.data[key].toString()
        if(val.indexOf('-') > -1){
          val = props.data[key].toFixed(val.split('-')[1])
          form[key] = val
          continue
        }
      }else if(key == 'lever'){
        levers.value = props.data[key]
      }
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
  form.lever = form.lever.toString()
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
  if(!levers.value.length){
    return ElMessage({
      type: 'tips',
      message: '请添加杠杆',
      offset: 200
    })
  }
  form.lever = levers.value.join(',')
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
