<template>
   <el-dialog :close-on-click-modal="false" width="700" class="reset-el-styte" title="账户余额" v-model="show"
    :append-to-body="true" @close="emit('close', false)">
    <div v-loading="dialogLoading" style="min-height: 400px;" class=" mt-[10px]">
      <template v-if="!dialogLoading">
          <div style="max-height:600px;" class="soll-list soll-list-y">
            
            <div class="text-sm mb-[10px]" style="color:#000;">业务账户（USDT计价）</div>
            <div style="color:#000;">
                <div class="table-list flex items-center">
                  <span class="w-0 flex-1 text-center bor-r bg-slate-50">账户</span>
                  <span class="w-0 flex-1 text-center bor-r">现金账户</span>
                  <span class="w-0 flex-1 text-center bor-r">外汇账户</span>
                  <span class="w-0 flex-1 text-center bor-r">合约账户</span>
                  <span class="w-0 flex-1 text-center bor-r">股票账户</span>
                  <span class="w-0 flex-1 text-center">大宗账户</span>
                </div>
                <div class="table-list flex">
                  <span class="w-0 flex-1 text-center bor-r bg-slate-50">金额</span>
                  <span class="w-0 flex-1 text-center bor-r">{{detailData.fund['money']  ? detailData.fund['money'] || 0 : '--'}}</span>
                  <span class="w-0 flex-1 text-center bor-r">{{detailData.fund['forex'] && detailData.fund['forex'][0] ? detailData.fund['forex'][0].amount || 0 : '--'}}</span>
                  <span class="w-0 flex-1 text-center bor-r">{{detailData.fund['futures'] && detailData.fund['futures'][0] ? detailData.fund['futures'][0].amount || 0 : '--'}}</span>
                  <span class="w-0 flex-1 text-center bor-r">{{detailData.fund['stock'] && detailData.fund['stock'][0] ? detailData.fund['stock'][0].amount || 0 : '--'}}</span>
                  <span class="w-0 flex-1 text-center">{{detailData.fund['blocktrade'] && detailData.fund['blocktrade'][0] ? detailData.fund['blocktrade'][0].amount || 0 : '--'}}</span>
                </div>
              </div>

            <div class="mt-[20px] reset-el-style-v2">
              
              <div class="flex justify-between items-center">
                <el-radio-group v-model="account">
                  <el-radio-button label="wallet">现金账户</el-radio-button>
                  <el-radio-button label="forex">外汇账户</el-radio-button>
                  <el-radio-button label="futures">合约账户</el-radio-button>
                  <el-radio-button label="stock">股票账户</el-radio-button>
                  <el-radio-button label="blocktrade">大宗账户</el-radio-button>
                </el-radio-group>
                <div>
                  <span class="mr-[10px] text-[13px]">隐藏0余额</span>
                  <el-switch v-model="showZero" size="small" />
                </div>
              </div>
              <div class="table-list flex bg-slate-50 mt-[10px]" style="color:#000;">
                <span class="flex-1 w-0 text-center">货币</span>
                <span class="flex-1 w-0 text-center">金额</span>
              </div>
              <template v-if="detailData.fund[account] && detailData.fund[account].length && (!accountAllZero || !showZero)">
                <div class="table-list flex" v-for="child in detailData.fund[account]" :key="child.currency" v-show="!(showZero && child.amount == 0)" style="color:#000;">
                  <span class="flex-1 w-0 text-center">{{ child.name }}</span>
                  <span class="flex-1 w-0 text-center">{{ child.amount }}</span>
                </div>
              </template>
              <div class="table-list flex" v-else>
                <span class="flex-1 w-0 text-center" style="color:#666;">暂无货币</span>
              </div>
            </div>

          </div>
         
      </template>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { apiUserFunds } from '/@/api/modules/business/player.api'
const detailData = reactive({ fund: {} })
const show = ref(true)
const showZero = ref(true)
const dialogLoading = ref(false)
const props = defineProps({
  partyid: { // 弹窗类型
    type: String,
    default: ''
  }
})

const account = ref("wallet")

const accountAllZero = computed(()=>{
  let result = false
  if(!detailData.fund[account]){
    return true
  }
  detailData.fund[account].map(item=>{
    if(item.amount > 0){
      result = true
    }
  })
  return result
})

const handleSearch = () => {
  dialogLoading.value = true
  const send_obj = { partyid: props.partyid };

  apiUserFunds(send_obj)
    .then(res => {
      detailData.fund = res
      dialogLoading.value = false
    })
    .catch(() => {
      emit('close');
    })
}
handleSearch();
const emit = defineEmits(['close', 'success'])
</script>
