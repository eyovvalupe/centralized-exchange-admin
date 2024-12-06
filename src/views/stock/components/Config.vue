<template>
   <el-dialog :close-on-click-modal="false" width="500" class="reset-el-styte" title="交易参数配置" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <el-form :model="form" :rules="rules" label-position="top" class="pt-[10px]" ref="ruleForm" v-loading="loading">
      <el-form-item label="交易杠杆" required  prop="lever">
          <LeverSet v-model:lever="form.lever" />
        </el-form-item>
        <el-form-item label="开仓数量规则" required prop="volumelimit">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input class="input-number" :controls="false" v-model="volumelimit1"  autocomplete="off" placeholder="" @blur="volumelimit1 <= 0 ? volumelimit1='' : '';updateVolumelimit()">
                <template #prefix>
                  <span class="mr-[10px]">最低下单量</span>
                </template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-input-number class="input-number" :controls="false" v-model="volumelimit2"  autocomplete="off" placeholder="" @blur="volumelimit2 <= 0 ? volumelimit2='' : '';updateVolumelimit()">
                <template #prefix>
                  <span class="mr-[10px]">倍增数量</span>
                </template>
              </el-input-number>
            </el-col>
          </el-row>
          
        </el-form-item>
       <div class="flex">
        <el-form-item label="开仓手续费" required prop="openfee" class="w-6/12">
          <el-input-number class="input-number" :min="0" :max="100" :controls="false" v-model="form.openfee"  autocomplete="off">
            <template #suffix>
              %
            </template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="平仓手续费" required prop="closefee"  class="w-6/12 ml-2">
          <el-input-number class="input-number" :min="0" :max="100" :controls="false" v-model="form.closefee" autocomplete="off">
            <template #suffix>
              %
            </template>
          </el-input-number>
        </el-form-item>
       </div>
        <el-form-item label="配资隔夜利息" required prop="interest">
          <el-input-number class="input-number" :min="0" :max="100" :controls="false" v-model="form.interest" autocomplete="off">
            <template #suffix>
              %
            </template>
          </el-input-number>
          <small class="txt-gray2 pt-[10px]">隔夜借贷资金每日利息</small> 
        </el-form-item>
        <el-form-item label="强平线" required prop="closingline">
          <el-input-number  class="input-number" :max="100" :min="0" @blur="form.closingline <= 0 ? form.closingline = '' : ''" :controls="false" v-model="form.closingline"  autocomplete="off">
            <template #suffix>
              %
            </template>
          </el-input-number>
        </el-form-item>
        <!-- <small class="txt-gray2">00:00 UTC、08:00 UTC、16:00 UTC 收取</small> -->
    </el-form>
    <template #footer>
      <div class="p-[10px]">
        <el-button round class="w-[98px]"  @click="emit('close', false)">取消</el-button>
        <el-button type="primary" round class="w-[98px]"  @click="handleGoogle" :loading="isLoading">确定 </el-button>
      </div>
    </template>
  </el-dialog>
   <el-dialog :close-on-click-modal="false" title="操作者验证" v-model="showGoogle" width="320">
    <GoogleVerify class="agentGoogle" @confirm="handleSubmit" @close="emit('close', false)" v-if="showGoogle" />
  </el-dialog>
</template>

<script setup>
import { apiConfig,apiUpdateConfig } from  '/@/api/modules/stock/index.api'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, dayjs } from 'element-plus'
import LeverSet from '../../../components/market/LeverSet.vue'
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

const form = ref({
  lever: '',
  openfee: '',
  closefee: '',
  interest: '',
  closingline: '',
  volumelimit: ''
})
 const volumelimit1 = ref('')
 const volumelimit2 = ref('')

 const updateVolumelimit = ()=>{
  if(volumelimit1.value && volumelimit2.value){
    form.value.volumelimit = volumelimit1.value+','+volumelimit2.value
  }else{
    form.value.volumelimit = ''
  }
 }

const trigger = ['blur', 'change']
const rules = {
  lever: [{ required: true, message: '', trigger }],
  openfee: [{ required: true, message: '', trigger }],
  closefee: [{ required: true, message: '', trigger }],
  interest: [{ required: true, message: '', trigger }],
  closingline: [{ required: true, message: '', trigger }],
  volumelimit: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])
const getData=()=>{
  loading.value = true;
  apiConfig().then(res=>{
    form.value = res;
    volumelimit1.value = res.volumelimit ? res.volumelimit.split(',')[0] || null : ''
    volumelimit2.value = res.volumelimit ? res.volumelimit.split(',')[1] || null : ''
    loading.value = false;
  })
}
getData();
// 新增
const handleSubmit = async (googlecode) => {
  isLoading.value = true
  showGoogle.value = false
  try {
    const send = { ...form.value,googlecode };
    if (props.data && props.data.id) {
      send.id = props.data.id;
    }
    const result = await apiUpdateConfig(send)
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
