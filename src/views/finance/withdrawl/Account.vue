<template>
   <el-dialog :close-on-click-modal="false" width="540" class="reset-el-styte" title="提现账号" v-model="show" :append-to-body="true"
    @close="emit('close', false)"
    >
    <div class="p-2">
      <div class="text-center" style="min-height: 100px;" v-loading="loading">
        <div v-if="dataInfo.channel === 'crypto'">
          <div class="table-list flex">
            <span>币种</span>
            <span  class="w-7/12 text-center">
              {{ dataInfo.symbol }}
              </span>
          </div>
          <div class="table-list flex">
            <span>网络</span>
            <span  class="w-7/12 text-center">
              {{ dataInfo.network }}
              </span>
          </div>
          <div class="table-list flex">
            <span>提现地址</span>
            <span  class="w-7/12 text-center cursor-pointer text-blue" @click="copy(address)">
              <label class="status success"> {{  networkArr[0]  }}</label>
              <label class="status close"> {{  networkArr[1]  }}</label>
              <label class="status blue"> {{  networkArr[2]  }}</label>
            </span>
          </div>
          <div class="table-list flex">
            <span>提现二维码</span>
            <div class="address-code address-qrcode-flex1">
              <qrcode-vue :value="dataInfo.address" :size="188" level="H" />
            </div>
          </div>
        </div>
        <div v-if="dataInfo.channel === 'bank'">
          <div class="table-list flex">
            <span>姓名</span>
            <span  class="w-7/12 text-center">
              {{ dataInfo.account_name }}
              </span>
          </div>
          <div class="table-list flex">
            <span>银行名</span>
            <span  class="w-7/12 text-center">
              {{ dataInfo.bank_name }}
              </span>
          </div>
          <div class="table-list flex">
            <span>银行卡号</span>
            <span  class="w-7/12 text-center cursor-pointer" @click="copy(dataInfo.bank_card_number)">
                {{ dataInfo.bank_card_number }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('close', false)">取消</el-button>
        <el-button type="primary" class="default_btn" @click="emit('close', false)">确定 </el-button>
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
import { copy } from '/@/utils'
// import { tr } from 'element-plus/es/locale'

const props = defineProps({
  order_no: { // 行数据
    type: String,
    default: ''
  }
})

const show = ref(true)
const loading = ref(false)
const dataInfo = ref({})
const networkArr=ref('')

onMounted(() => {
  init();
})

const init=()=>{
  loading.value = true
  apiWithdrawAccount({order_no:props.order_no}).then(res=>{
      let adr=res.address;
      dataInfo.value = res
      networkArr.value = [adr.substring(0,4),adr.substring(4,adr.length-4),adr.substring(adr.length-4)]
      loading.value = false
  })
}

const emit = defineEmits(['close', 'success'])

</script>
