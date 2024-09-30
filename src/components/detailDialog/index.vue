<template>
     <el-dialog :close-on-click-modal="false" v-model="dialogType.showDialog" :loading="dialogLoading" width="480" title="订单详情"
        @close="closeDialogType">
        <div v-loading="dialogLoading" class="order-con-ovderhide">
            <template v-if="!dialogLoading">
                <div v-for="(item, index) in column" :key="index"
                    class="table-list-order flex flex-nowrap justify-center">
                    <span class="table-span-left"
                        style="display: flex;justify-content: center;flex-direction: column;">{{ item.label }}</span>
                    <span class="table-span-right">
                        <!-- <span v-if="item.prop ==='ratio'"  :class="detailData[item.prop]<0?'success':detailData[item.prop]>0?'failure':''">{{ detailData[item.prop] }} %</span> -->
                        <span v-if="['offset'].includes(item.prop)">
                            {{ transKeyName(detailData['lever_type'], 'lever_type') }}
                            <b class="split-line"></b>
                            {{ transKeyName(detailData[item.prop], item.prop) }}
                            <b class="split-line"></b>
                            {{ detailData['lever'] }}X
                        </span>
                        <span v-else-if="['status'].includes(item.prop)"
                            :class="detailData[item.prop] == 'lock' ? 'status-bg none' : ''">
                            {{ transKeyName(detailData[item.prop], item.prop) }}
                        </span>
                        <span v-else-if="item.prop === 'username'"> {{ detailData['uid'] }} / {{ detailData[item.prop]
                            }}</span>
                        <span v-else-if="item.prop === 'price_type'"> {{ transKeyName(detailData[item.prop], item.prop)
                            }} ｜ {{
                                detailData['open_price'] }}</span>
                        <span v-else-if="item.prop === 'lever'">{{ detailData[item.prop] }}x</span>
                        <span v-else-if="item.prop === 'profit'"
                            style="display: flex;justify-content: center;flex-direction: column;"
                            :class="detailData[item.prop] > 0 ? 'success' : detailData[item.prop] < 0 ? 'failure' : ''">{{
                                detailData[item.prop] }} <br> {{
                                detailData['ratio'] * 100
                            }}%</span>
                        <span v-else-if="item.prop === 'stop_profit'">
                            <span v-if="detailData[item.prop]">
                                {{ transKeyName(detailData['stop_profit_type'], 'stop_profit_type') }}
                                {{ detailData['stop_profit_price'] }}
                            </span>
                            <span v-else>
                                禁用
                            </span>
                        </span>
                        <span v-else-if="item.prop === 'stop_loss'">
                            <span v-if="detailData[item.prop]">
                                {{ transKeyName(detailData['stop_loss_type'], 'stop_loss_type') }}
                                {{ detailData['stop_loss_price'] }}
                            </span>
                            <span v-else>
                                禁用
                            </span>
                        </span>
                        <span v-else :class="[item.prop, detailData[item.prop]]" class="status-bg">{{
                            transKeyName(detailData[item.prop], item.prop) }}</span>
                    </span>
                </div>
            </template>
        </div>
    </el-dialog>
</template>

<script setup>
import {
    getDetail
} from '/@/api/modules/market/index.api'
import {
    apiQueryOne
} from '/@/api/modules/contract'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
const props = defineProps({
    contract: {
        type: Boolean,
        default: false
    },
    orderNo: {
        type: String,
        default: ''
    }
})
const emit = defineEmits('close')
const detailData = ref({})
const dialogLoading = ref(false)
const dialogType = reactive({
    showDialog: true
})
const transKeyName = (val, key) => {
    let str = val;
    let obj = {};
    if (key === 'lever_type') {
        obj = {
            cross: '全仓',
            isolated: '逐仓'
        }
    } else if (key === 'offset') {
        obj = {
            long: '买涨',
            short: '买跌'
        }
    } else if (key === 'price_type') {
        obj = {
            market: '市价',
            limit: '限价'
        }
    } else if (['stop_loss_type', 'stop_profit_type'].includes(key)) {
        obj = {
            price: '价格',
            amount: '金额',
            ratio: '百分比(%)',
        }
    } else if (key === 'status') {
        obj = {
            none: '开仓',
            lock: '锁定',
            open: '持仓',
            close: '平仓',
            fail: '失败',
            done: '已结算',
            cancel: '已取消',
        }
    }
    str = obj[val] || val;
    return str;
}
const column = reactive([
    { prop: 'order_no', label: '订单号' },
    { prop: props.contract ? 'name' : 'symbol', label: props.contract ? '合约' : '股票代码' },
    { prop: 'status', label: '状态' },
    { prop: 'offset', label: '开仓' },
    { prop: 'price_type', label: '限价方式', },
    { prop: 'open_volume', label: '开仓数量' },
    { prop: 'unsold_volume', label: '未售数量' },
    { prop: 'margin', label: '开仓保证金' },
    { prop: 'surplus_margin', label: '剩余保证金' },
    { prop: 'unlock', label: '解锁金额', },
    { prop: 'profit', label: '订单收益/百分比', color: true },
    { prop: 'fee', label: '开仓手续费' },
    { prop: 'interest', label: '持仓手续费' },
    { prop: 'open_price', label: '开仓价格' },
    { prop: 'settled_price', label: '订单结算价格' },
    { prop: 'stop_profit', label: '止盈' },
    { prop: 'stop_loss', label: '止损' },
    { prop: 'date', label: '开仓时间' }

])

const showDialog = () => {
    dialogType.title = '订单详情';
    dialogType.showDialog = true;
    dialogLoading.value = true;
    const func= props.contract ? apiQueryOne : getDetail;
    func({ order_no: props.orderNo }).then(res => {
        detailData.value = res;
    }).finally(() => {
        dialogLoading.value = false;
    })
}
const closeDialogType = () => {
    emit('close');
}
showDialog();
</script>
<style scoped>
.order-con-ovderhide {
    min-height: 300px;
    /* overflow: auto; */
}
</style>