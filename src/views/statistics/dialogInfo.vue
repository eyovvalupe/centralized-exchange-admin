<template>
     <el-dialog :close-on-click-modal="false" width="700" class="reset-el-styte" title="充提货币详情" v-model="show" :append-to-body="true"
        >
        <div class="py-[10px] reset-el-style-v2"  v-loading="dialogLoading" style="min-height: 100px;">
            <el-table :data="detailData" border v-if="detailData.length">
                <el-table-column v-for="(item, index) in columnBase" :key="index"
                    :label="item.label" align="center">
                    <template #default="scope">
                        <img class="w-[16px] h-[16px] mr-[6px] rounded-full" :src="`/images/crypto/${scope.row[item.prop].toLocaleUpperCase()}.png`" :alt="scope.row[item.prop].toLocaleUpperCase()"  v-if="item.prop == 'currency'" />
                        <span :class="scope.row[item.prop] >= 0 ? 'success' : 'fail'" class="status" v-if="item.prop == 'balance'">
                            {{scope.row[item.prop] > 0 ? '+' : ''}}{{ scope.row[item.prop] ? scope.row[item.prop] : '0' }}
                        </span>
                        <span v-else>
                            {{ scope.row[item.prop] }}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <el-empty class="nodata" v-else-if="!dialogLoading" description="暂无数据" />
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { dayjs } from 'element-plus'
import { getAgentCurrency } from '/@/api/modules/business/agents.api'
import { getGlobalCurrencyList, getGlobalCurrencyUser,getGlobalCurrencyMy } from '/@/api/modules/base.api'
const detailData = ref([])
const show = ref(false)
const dialogLoading = ref(false)
const props = defineProps({
    title: { // 弹窗类型
        type: String,
        default: ''
    }
})

const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = ref([
    { prop: 'currency', label: '币种',minWidth:gw(165), align: 'center' },
    { prop: 'deposit', label: '充值',minWidth:gw(165), align: 'center' },
    { prop: 'withdraw', label: '提现',minWidth:gw(165), align: 'center' },
    { prop: 'balance', label: '充提差',minWidth:gw(165), align: 'center' },
])

function open(start_time,end_time,type,partyid) {
    show.value = true
    let api
    const send = {};
    send.start_time = dayjs(start_time).format('YYYY-MM-DD')
    send.end_time = dayjs(end_time).format('YYYY-MM-DD')
    if(type === 'agentUser'){
        api = getGlobalCurrencyUser
        send.partyid = partyid
    }else if(type === 'platform'){
        api = getGlobalCurrencyList
    }else if(type === 'my'){
        api = getGlobalCurrencyMy
    }else if(type =='agent'){
        api = getAgentCurrency
        send.partyid = partyid
    }
    
    dialogLoading.value = true
        api(send).then(res => {
            detailData.value = res;
        }).finally(() => {
            dialogLoading.value = false
        })
}
defineExpose({
  open
})
</script>

<style lang="scss" scoped></style>