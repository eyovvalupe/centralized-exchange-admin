<template>
   <el-dialog :close-on-click-modal="false" width="540" class="reset-el-styte" title="提现账号" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <div class="p-2">
      <div>地址：地址 地址地址</div>
      <div class="address-code">
        <qrcode-vue :value="link" :size="188" level="H" />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('close', false)">取消</el-button>
        <el-button type="primary" class="default_btn" @click="handleSubmit" :loading="isLoading">确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { apiWithdrawAccount } from '/@/api/modules/business/withdrawl-order.api'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSessionToken } from '/@/api/modules/base.api'
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
  order_no: { // 行数据
    type: String,
    default: ''
  }
})

const ruleForm = ref(null)
const formLabelWidth = ref(100)
const loading = ref(false)
const isLoading = ref(false)
const show = ref(true)
const link = ref('')
const form = reactive({
  order_no: '',
  status: '',
  safeword: '',
  token: '',
  remarks: ''
})
onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      form[key] = props.data[key]
    }
  }
  form.status = '';
  init();
})
const trigger = ['blur', 'change']
const init=()=>{
  apiWithdrawAccount({order_no:props.order_no}).then(res=>{
    console.log(res);
    link.value = res
  })
}
const rules = {
  status: [{ required: true, message: '', trigger }],
  safeword: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])
// 新增
const handleSubmit = async () => {
  ruleForm.value.validate(valid => {
    if (valid) {
      submit()
    }
  })
}

const submit = async () => {
  // 发送请求
  isLoading.value = true
  try {
    const token = await getSessionToken()
    const send = { ...form, token };
    const result = await apiDepositCheck(send)
    console.log(result)
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
</script>
