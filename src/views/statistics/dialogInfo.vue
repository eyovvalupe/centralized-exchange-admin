<template>
     <el-dialog :close-on-click-modal="false" width="520" class="reset-el-styte" :title="`${title}详细信息`" v-model="show" :append-to-body="true"
        @close="emit('close', false)">
        <div v-loading="dialogLoading" style="min-height: 160px;">
            <div v-for="(item, index) in columnBase" :key="index" class="table-list flex flex-nowrap justify-between">
                <span>{{ item.label }}</span>
                <span class="w-8/12 text-center">{{ detailData[item.prop] || '-' }}</span>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { apiUser } from '/@/api/modules/business/player.api'
import { dayjs } from 'element-plus'
const detailData = ref({})
const show = ref(true)
const dialogLoading = ref(false)
const props = defineProps({
    title: { // 弹窗类型
        type: String,
        default: ''
    }
})
const columnBase = reactive([
    { prop: 'main', label: '交易账户', width: 120, align: 'center' },
    { prop: 'USD', label: '美元', width: 100, align: 'center' },
    { prop: 'USDT', label: 'USDT', width: 100, align: 'center' },
    { prop: 'BTC', label: 'BTC', width: 100, align: 'center' },
    { prop: 'ETH', label: 'ETH', width: 100, align: 'center' },
])
const emit = defineEmits(['close', 'success'])
</script>

<style lang="scss" scoped></style>