<template>
     <el-dialog :close-on-click-modal="false" width="720" class="reset-el-styte" title="充提货币详情" v-model="show" :append-to-body="true"
        >
        <div style="min-height: 160px;">
            <!-- <div v-for="(item, index) in columnBase" :key="index" class="table-list flex flex-nowrap justify-between">
                <span>{{ item.label }}</span>
                <span class="w-8/12 text-center">{{ detailData[item.prop] || '-' }}</span>
            </div> -->
            <el-table :data="detailData" border
                v-loading="dialogLoading">
                <el-table-column v-for="(item, index) in columnBase" :key="index"
                    :label="item.label" align="center">
                    <template #default="scope">
                        {{ scope.row[item.prop] ? scope.row[item.prop] : '0' }}
                    </template>
                </el-table-column>
                <template v-slot:empty>
                    <el-empty class="nodata" description="暂无数据" />
                </template>
            </el-table>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { dayjs } from 'element-plus'
import { getGlobalCurrencyList, getGlobalCurrencyUser } from '/@/api/modules/base.api'
const detailData = ref([])
const show = ref(false)
const dialogLoading = ref(false)
const props = defineProps({
    title: { // 弹窗类型
        type: String,
        default: ''
    }
})
const columnBase = ref([
    { prop: 'currency', label: '币种', align: 'center' },
    { prop: 'deposit', label: '充值(USDT)', align: 'center' },
    { prop: 'withdraw', label: '提现(USDT)', align: 'center' },
    { prop: 'balance', label: '充提差(USDT)', align: 'center' },
])
// const columnBase = reactive([
//     { prop: 'main', label: '交易账户', width: 120, align: 'center' },
//     { prop: 'USD', label: '美元', width: 100, align: 'center' },
//     { prop: 'USDT', label: 'USDT', width: 100, align: 'center' },
//     { prop: 'BTC', label: 'BTC', width: 100, align: 'center' },
//     { prop: 'ETH', label: 'ETH', width: 100, align: 'center' },
// ])
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