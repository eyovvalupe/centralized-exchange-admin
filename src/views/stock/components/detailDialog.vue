<template>
     <el-dialog :close-on-click-modal="false" v-model="dialogType.showDialog" :loading="dialogLoading" width="400" title="订单详情"
        @close="closeDialogType">
        <div v-loading="dialogLoading" style="min-height: 200px;">
            <template v-if="!dialogLoading">
                <div v-for="(item, index) in column" :key="index"
                    class="table-list-order flex flex-nowrap justify-center">
                    <span class="table-span-left">{{ item.label }}</span>
                    <span class="table-span-right">
                        <template v-if="Array.isArray(item.prop)">
                            <span v-for="(arrItem, idx) in item.prop" :key="arrItem" class="arr">
                                <span v-if="idx">｜</span>
                                <span
                                    :class="[arrItem, item.color ? (detailData[arrItem] == 0 ? '' : detailData[arrItem] < 0 ? 'text-red-800' : 'text-green-800') : '']">
                                    <span v-if="arrItem === 'ratio'">{{ detailData[arrItem] }}%</span>
                                    <span v-else-if="arrItem == 'lever'">{{ detailData[arrItem] }}x</span>
                                    <span v-else-if="arrItem == 'price'">{{ detailData['price'] ||
                                        detailData['open_price'] }}</span>
                                    <span v-else>{{ transKeyName(detailData[arrItem], arrItem) || '-' }}</span>
                                </span>
                            </span>
                        </template>
                        <span v-else :class="[item.prop, detailData[item.prop]]">
                            {{ transKeyName(detailData[item.prop], item.prop) }}
                        </span>
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
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
const props = defineProps({
    orderNo: {
        type: String,
        default: ''
    }
})
const emit =defineEmits('close')
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
    } else if (key === 'stop_profit_type') {
        obj = {
            price: '价格',
            amount: '金额',
            ratio: '百分比',
        }
    } else if (key === 'status') {
        obj = {
            none: '开仓',
            lock: '锁定',
            open: '持仓',
            close: '平仓',
            fail: '失败',
            cancel: '已取消',
        }
    }
    str = obj[val] || val;
    return str;
}


const column = reactive([
    { prop: 'order_no', label: '订单号' },
    { prop: ['username', 'uid'], label: 'UID/用户名' },
    { prop: 'father_username', label: '代理称' },
    { prop: 'market', label: '市场' },
    { prop: 'symbol', label: '交易代码' },
    { prop: ['offset', 'lever_type', 'lever'], label: '开仓方向' },
    { prop: ['price_type', 'price'], label: '限价方式/价格', },
    { prop: ['open_volume', 'unsold_volume'], label: '开仓/未售数量' },
    { prop: ['margin', 'surplus_margin'], label: '保证金/剩余金额' },
    { prop: 'unlock', label: '解锁金额', },
    { prop: ['profit', 'ratio'], label: '订单收益/百分比', color: true },
    { prop: 'fee', label: '手续费' },
    { prop: 'open_price', label: '开仓价格' },
    { prop: 'settled_price', label: '订单结算价格' },
    { prop: ['stop_profit', 'stop_profit_type', 'stop_profit_price'], label: '止盈' },
    { prop: ['stop_loss', 'stop_loss_type', 'stop_loss_price'], label: '止损' },
    { prop: 'status', label: '状态' },
    { prop: 'date', label: '订单时间' }
])

const showDialog = () => {
    dialogType.title = '订单详情';
    dialogType.showDialog = true;
    dialogLoading.value = true;
    getDetail({ order_no: props.orderNo }).then(res => {
        detailData.value = res;
    }).finally(() => {
        dialogLoading.value = false;
    })
}
const closeDialogType = () => {
    emit('close');
}
showDialog();
const copy = text => {
    if (navigator.clipboard) {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                ElMessage({
                    message: '复制成功',
                    type: 'success',
                })
            })
            .catch(err => {
                console.error('复制失败: ', err)
                ElMessage({
                    message: '复制失败',
                    type: 'error',
                })
            })
    } else {
        const inputEle = document.createElement('input')
        inputEle.value = text
        document.body.appendChild(inputEle)
        inputEle.select()
        try {
            const successful = document.execCommand('copy')
            const msg = successful ? '复制成功' : '复制失败'
            ElMessage({
                message: msg,
                type: successful ? 'success' : 'error',
            })
        } catch (err) {
            console.error('复制失败: ', err)
            ElMessage({
                message: '复制失败',
                type: 'error',
            })
        }
        inputEle.remove()
    }
}
</script>