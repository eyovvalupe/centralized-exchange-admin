<template>
   <el-dialog :close-on-click-modal="false" width="500" class="reset-el-styte" title="提现账号" v-model="show" :append-to-body="true"
    @close="emit('close', false)"
    >
    <div class="py-[10px]">
      <div style="min-height: 240px;" v-loading="loading">
        <div v-if="dataInfo.channel === 'crypto'">
          <div class="table-list-order flex">
            <span class="table-span-left">币种</span>
            <span class="table-span-right">
              <img class="w-[16px] h-[16px] mr-[10px]" :src="`/images/crypto/${dataInfo.symbol.toUpperCase()}.png`" :alt="dataInfo.symbol.toUpperCase()">{{ dataInfo.symbol }}
              </span>
          </div>
          <div class="table-list-order flex">
            <span class="table-span-left">网络</span>
            <span class="table-span-right">
              {{ dataInfo.network }}
              </span>
          </div>
          <div class="table-list-order flex">
            <span class="table-span-left">提现地址</span>
            <span class="table-span-right cursor-pointer text-blue" @click="copy(dataInfo.address)">
              {{dataInfo.address}}
            </span>
          </div>
          <div class="table-list-order flex">
            <span class="table-span-left">提现二维码</span>
            <div class="table-span-right">
              <qrcode-vue :value="dataInfo.address" :size="100" level="H" />
            </div>
          </div>
        </div>
        <div v-if="dataInfo.channel === 'bank'">
          <div class="table-list-order flex">
            <span class="table-span-left">姓名</span>
            <span  class="table-span-right">
              {{ dataInfo.account_name }}
              </span>
          </div>
          <div class="table-list-order flex">
            <span class="table-span-left">银行名</span>
            <span  class="table-span-right">
              {{ dataInfo.bank_name }}
              </span>
          </div>
          <div class="table-list-order flex">
            <span class="table-span-left">银行卡号</span>
            <span class="table-span-right cursor-pointer" @click="copy(dataInfo.bank_card_number)">
                {{ dataInfo.bank_card_number }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
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

onMounted(() => {
  init();
})

const init=()=>{
  loading.value = true
  apiWithdrawAccount({order_no:props.order_no}).then(res=>{
      dataInfo.value = res
      loading.value = false
  })
}

const emit = defineEmits(['close', 'success'])

</script>
