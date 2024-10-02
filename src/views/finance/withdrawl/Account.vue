<template>
   <el-dialog :close-on-click-modal="false" width="540" class="reset-el-styte" title="提现账号" v-model="show" :append-to-body="true"
    @close="emit('close', false)"
    >
    <div class="p-2">
      <div v-if="channel === 'crypto'">
        <div>钱包地址：{{address}}</div>
        <div class="address-code">
          <qrcode-vue :value="link" :size="188" level="H" />
        </div>
      </div>
      <div v-else-if="channel === 'bank'">
        <div>姓名：{{account_name}}</div>
        <div>银行名：{{bank_name}}</div>
        <div>银行卡号：{{bank_card_number}}</div>
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
// import { tr } from 'element-plus/es/locale'

const props = defineProps({
  order_no: { // 行数据
    type: String,
    default: ''
  }
})

const show = ref(true)
const address = ref('')
const channel = ref('')
const account_name = ref('')
const bank_name = ref('')
const bank_card_number = ref('')

onMounted(() => {
  init();
})

const init=()=>{
  apiWithdrawAccount({order_no:props.order_no}).then(res=>{
    if(res){
      address.value = res.address
      account_name.value = res.account_name
      bank_name.value = res.bank_name
      bank_card_number.value = res.bank_card_number
      channel.value = res.channel
    }
    // link.value = res
  })
}

const emit = defineEmits(['close', 'success'])

</script>
