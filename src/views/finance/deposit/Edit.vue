<template>
   <el-dialog :close-on-click-modal="false" width="540" class="reset-el-styte" title="订单处理" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <el-form :model="form" label-position="top" :rules="rules" ref="ruleForm" v-loading="loading">
      <el-form-item label="状态" :label-width="formLabelWidth" required prop="status">
        <el-select v-model="form.status" class="w-full" placeholder="请选择状态">
          <el-option label="通过" value="success" />
          <el-option label="拒绝" value="failure" />
        </el-select>
      </el-form-item>
      <el-form-item label="失败原因" :label-width="formLabelWidth" v-if="form.status=='failure'">
        <el-input v-model="form.remarks" :autosize="{ minRows: 2, maxRows: 3 }" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('close', false)">取消</el-button>
        <el-button type="primary" class="default_btn" @click="showPwdEvent" :loading="isLoading">确定 </el-button>
      </span>
    </template>
  </el-dialog>
   <el-dialog :close-on-click-modal="false" width="420" class="reset-el-styte" title="交易密码" v-model="showPwd">
    <el-form :model="form" label-position="top" :rules="rules" ref="ruleForm2" v-loading="loading">
      <el-form-item label="交易密码" required :label-width="formLabelWidth" prop="safeword">
        <el-input v-model="form.safeword" type="password" autocomplete="off" placeholder="请输入交易密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showPwd=false">取消</el-button>
        <el-button type="primary" class="default_btn" @click="handleSubmit" :loading="isLoading">确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { apiDepositCheck } from '/@/api/modules/business/recharge-order.api'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSessionToken } from '/@/api/modules/base.api'

const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const ruleForm = ref(null)
const ruleForm2 = ref(null)
const formLabelWidth = ref(100)
const loading = ref(false)
const isLoading = ref(false)
const showPwd = ref(false)
const show = ref(true)

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
  console.log(form, props.data);
})
const trigger = ['blur', 'change']

const rules = {
  status: [{ required: true, message: '', trigger }],
  safeword: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])
// 新增
const handleSubmit = async () => {
  ruleForm2.value.validate(valid => {
    if (valid) {
      submit()
    }
  })
}

const submit = async () => {
  showPwd.value = false;
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
const showPwdEvent=()=>{
  ruleForm.value.validate(valid => {
    if (valid) {
      showPwd.value = true;
    }
  })

}
</script>
