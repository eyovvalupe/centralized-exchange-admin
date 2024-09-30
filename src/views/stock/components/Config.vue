<template>
   <el-dialog :close-on-click-modal="false" width="480" class="reset-el-styte" title="交易参数配置" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <el-form :model="form" :rules="rules" label-position="top" ref="ruleForm" v-loading="loading">
      <el-form-item label="交易杠杆" required  prop="lever">
          <el-input v-model="form.lever"  autocomplete="off" placeholder="支持多个，英文逗号隔开" />
          <small class="txt-gray2">支持多个，英文逗号隔开</small> 
        </el-form-item>
        <el-form-item label="开仓数量规则" required  prop="volumelimit">
          <el-input v-model="form.volumelimit"  autocomplete="off" placeholder="" />
          <small class="txt-gray2">逗号隔开，第一个最低下单量，第二个倍增数量</small> 
        </el-form-item>
       <div class="flex">
        <el-form-item label="开仓手续费(%)" required prop="openfee" class="w-6/12">
          <el-input v-model="form.openfee"  autocomplete="off" />
        </el-form-item>
        <el-form-item label="平仓手续费(%)" required prop="closefee"  class="w-6/12 ml-2">
          <el-input v-model="form.closefee" autocomplete="off" />
        </el-form-item>
       </div>
        <el-form-item label="配资利息" required prop="interest">
          <el-input v-model="form.interest" autocomplete="off" />
          <small class="txt-gray2">隔夜借贷资金每日利息</small> 
        </el-form-item>
        <el-form-item label="强平线" required prop="closingline">
          <el-input v-model="form.closingline"  autocomplete="off" />
        </el-form-item>
        <!-- <small class="txt-gray2">00:00 UTC、08:00 UTC、16:00 UTC 收取</small> -->
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
import { apiConfig,apiUpdateConfig } from  '/@/api/modules/stock/index.api'
import { ref, reactive, onMounted } from 'vue'
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

const form = ref({
  lever: '',
  openfee: '',
  closefee: '',
  interest: '',
  closingline: '',
  volumelimit: ''
})
 

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
