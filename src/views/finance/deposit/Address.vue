<template>
   <el-dialog :close-on-click-modal="false" width="500" class="reset-el-styte" title="充值地址" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
     <div class="py-[10px]" style="min-height: 100px;" v-loading="loading">
      <template v-if="dataInfo">
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
            <span class="table-span-left">地址</span>
            <!-- @click="openLink" -->
            <span  class="table-span-right cursor-pointer" @click="copy(addressText)">
                <!-- <a class="status success"> {{  networkArr[0]  }}</a>
                <a class="status close"> {{  networkArr[1]  }}</a>
                <a class="status blue"> {{  networkArr[2]  }}</a> -->
                {{ dataInfo.address }}
            </span>
          </div>
      </template>
     </div>
  </el-dialog>
</template>

<script setup>
import { apiAddress } from '/@/api/modules/business/recharge-order.api'
import { ref, reactive, onMounted } from 'vue'
import { copy } from '/@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
// import QrcodeVue from "qrcode.vue"

const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})
const urls={
  TRC20:'https://tronscan.org/#/address/',
  ERC20:'https://etherscan.io/address/',
}
// 倒计时
// const s = ref(0)
// const currentRate = computed(() => {
//     return s.value * 100 / 60
// })
const dataInfo = ref(null)
const loading = ref(false)
const show = ref(true)
const networkArr=ref('')
const addressText = ref('')
const getData=()=>{
  loading.value = true
  apiAddress({order_no:props.data.order_no}).then(res=>{
    dataInfo.value = res;
    const adr=res.address;
    addressText.value = res.address;
    networkArr.value = [adr.substring(0,4),adr.substring(4,adr.length-4),adr.substring(adr.length-4)]
    loading.value = false
  })
}
const openLink=()=>{
  // window.open(urls[dataInfo.value.network]+dataInfo.value.address)
}
const emit = defineEmits(['close', 'success'])

getData();
</script>
