<template>
   <el-dialog :close-on-click-modal="false" width="540" class="reset-el-styte" title="订单处理" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <div v-loading="loading" style="min-height:350px;">
      <template v-if="dataInfo">
        <div class="status-info">
          <div class="status-info__icon">
              <img src="/@/assets/images/success.svg" v-if="dataInfo.status == 'success'" />
              <img src="/@/assets/images/fail.svg" v-else-if="dataInfo.status == 'failure'" />
              <img src="/@/assets/images/reviewing.svg" v-else />
          </div>
          <div class="status-info__title" v-if="dataInfo.status == 'success'">审核通过</div>
          <div class="status-info__title" v-else-if="dataInfo.status == 'failure'">审核拒绝</div>
          <div class="status-info__title" v-else>审核中</div>
        </div>
        <div class=" mt-[20px]">
          <div class="table-list-order flex">
            <span class="table-span-left">币种</span>
            <span  class="table-span-right flex items-center">
              <img class="w-[16px] h-[16px] mr-[10px]" :src="`/images/crypto/${dataInfo.currency.toUpperCase()}.png`" :alt="dataInfo.currency.toUpperCase()"> {{ dataInfo.currency }}
            </span>
          </div>
          <div class="table-list-order flex">
            <span class="table-span-left">网络</span>
            <span class="table-span-right">
              {{ dataInfo.network }}
              </span>
          </div>
          <div class="table-list-order flex">
            <span class="table-span-left">充值金额</span>
            <span class="table-span-right">
              <span class="text-red text-base"> {{ data.amount }}</span>
             
              </span>
          </div>
          <div class="table-list-order flex">
            <span class="table-span-left">地址</span>
            <!-- @click="openLink" -->
            <span  class="table-span-right cursor-pointer" @click="copy(addressText)">
                <!-- <a class="status success"> {{  networkArr[0]  }}</a>
                <a class="status close"> {{  networkArr[1]  }}</a>
                <a class="status blue"> {{  networkArr[2]  }}</a> -->
                {{ dataInfo.address }}
            </span>
          </div>
        </div>
    </template>

    <el-form :model="form" label-position="top" :rules="rules" class="pt-[20px]" ref="ruleForm">
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
  
    </div>
    <template v-if="!loading" #footer>
       <div class="p-[10px]">
        <el-button @click="emit('close', false)"  class="w-[98px]" round>取消</el-button>
        <el-button type="primary" class="w-[98px]" round @click="showPwdEvent" :loading="isLoading">确定 </el-button>
      </div>
      
    </template>
  
  </el-dialog>

  <Safeword v-model="showPwd" @submit="submit"  @cancel="show=false;" />
 
</template>

<script setup>
import { apiDepositCheck,apiAddress } from '/@/api/modules/business/recharge-order.api'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSessionToken } from '/@/api/modules/base.api'

import Safeword from '/@/components/safeword/index.vue'

const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})

const ruleForm = ref(null)
const formLabelWidth = ref(100)
const loading = ref(false)
const isLoading = ref(false)
const showPwd = ref(false)
const show = ref(true)

const dataInfo = ref(null)
const addressText = ref('')

const getData = ()=>{
  loading.value = true
  apiAddress({order_no:props.data.order_no}).then(res=>{
    dataInfo.value = res;
    addressText.value = res.address;
    loading.value = false
  })
}

getData();
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
})
const trigger = ['blur', 'change']

const rules = {
  status: [{ required: true, message: '', trigger }],
  safeword: [{ required: true, message: '', trigger }]
}

const emit = defineEmits(['close', 'success'])


const submit = async (safeword) => {
  form.safeword = safeword
  showPwd.value = false;
  // 发送请求
  isLoading.value = true
  try {
  const token = await getSessionToken()
  const send = { ...form, token };
    const result = await apiDepositCheck(send)
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
