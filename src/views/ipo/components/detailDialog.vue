<template>
     <el-dialog :close-on-click-modal="false" v-model="dialogType.showDialog" :loading="dialogLoading" width="400" title="IPO订单详情"
        @close="closeDialogType">
        <div v-loading="dialogLoading" style="min-height: 200px;">
            <template v-if="!dialogLoading">
                <div v-for="(item, index) in column" :key="index"
                    class="table-list-order flex flex-nowrap justify-center">
                    <span class="table-span-left">{{ item.label }}</span>
                    <span class="table-span-right">
                        <template v-if="Array.isArray(item.prop)">
                            <template v-for="(arrItem, idx) in item.prop" :key="arrItem">
                                <span v-if="idx">｜</span>
                                <span>{{ transKeyName(detailData[arrItem], arrItem) || 0 }}</span>
                            </template>
                        </template>
                        <template v-else>
                            <span  v-if="item.prop==='status'" class="status-bg" :class="detailData[item.prop]=='success'?'status-green':detailData[item.prop]=='failure'?'status-yellow':''">
                                {{ transKeyName(detailData[item.prop], item.prop) }}
                            </span>
                             <span v-else> {{ transKeyName(detailData[item.prop], item.prop) }}</span>
                        </template>
                    </span>
                </div>
            </template>
        </div>
    </el-dialog>
</template>

<script setup>
import { getDetail } from '/@/api/modules/ipo/index.api'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { ElDialog, ElMessage, dayjs } from 'element-plus'
const props = defineProps({
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


const column = reactive([
    { prop: 'order_no', label: '订单号',width: 100,  align: 'center' },
    { prop: 'username', label: '用户名', align: 'center' },
    { prop: 'uid', label: 'UID', align: 'center' },
    { prop: 'father_username', label: '代理', align: 'center' },
    { prop: 'company_name', label: '公司名称', align: 'center' },
    { prop: ['market','symbol'], label: '市场|交易代码', align: 'center' },
    { prop: 'vip', label: 'VIP杠杆', align: 'center', width: 120 },
    { prop: 'lever', label: 'VIP杠杆杠杆', align: 'center', width: 120 },
    { prop: ['volume','winning'], label: '认购数量|中签数量', align: 'center' },
    { prop: 'issue_price', label: '认购价格', align: 'center' },
    { prop: 'fee', label: '手续费', align: 'center', width: 60 },
    { prop: 'status', label: '状态', align: 'center' },
    { prop: 'date', label: '订单时间', align: 'center' },
])
const transKeyName = (val, key) => {
    let str = val;
    let obj = {};
    if (key === 'status') {
        obj = {
            'lock': '认购',
            'success': '中签',
            'failure': '未中签'
        }
    }
    str = obj[val] || val;
    return str;
}
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