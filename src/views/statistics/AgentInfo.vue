<template>
   <el-dialog :close-on-click-modal="false" width="520" class="reset-el-styte" :title="`代理充提详情_${searchForm.start_time}~${searchForm.end_time}`" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <div v-loading="dialogLoading" style="min-height: 400px;">
      <template v-if="!dialogLoading">
        <el-table :data="tableData" row-class-name="bg-one-row" :border="tableData.length"
          :class="tableData.length ? '' : 'noborder'" v-loading="isLoading">
          <el-table-column v-for="(item, index) in columnBase" :key="index" :width="item.width" :label="item.label"
            :align="item.align">
            <template #default="scope">
              {{ scope.row[item.prop] ? scope.row[item.prop] : 'N/A' }}
            </template>
          </el-table-column>
          <template v-slot:empty>
            <el-empty class="nodata" description="暂无数据" />
          </template>
        </el-table>
      </template>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { dayjs } from 'element-plus'
const detailData = ref({})
const show = ref(true)
const tableData = ref([]);

const dialogLoading = ref(false)
const props = defineProps({
  data: { // 弹窗类型
    type: Object,
    default: () => ({})
  },
  timeRanges: { // 弹窗类型
    type: Array,
    default: () => ([])
  }
})
const searchForm = reactive({
  start_time:dayjs(props.timeRanges[0]).format('YYYY-MM-DD'),
  end_time:dayjs(props.timeRanges[1]).format('YYYY-MM-DD'),
})

const columnBase = ref([
  { prop: 'currency', label: '币种', align: 'center' },
  { prop: 'deposit', label: '充值(USDT)', align: 'center' },
  { prop: 'withdraw', label: '提现(USDT)', align: 'center' },
  { prop: 'balance', label: '充提差(USDT)', align: 'center' },
])


const handleSearch = () => {
  dialogLoading.value = true
  const send_obj = {  };
  if (props.data.partyid) {
    send_obj.partyid = props.data.partyid
  }
  if (searchForm.start_time) {
    send_obj.start_time = dayjs(searchForm.start_time).format('YYYY-MM-DD')
  }
  if (searchForm.end_time) {
    send_obj.end_time = dayjs(searchForm.end_time).format('YYYY-MM-DD')
  }
  dialogLoading.value = false
}
handleSearch();
const emit = defineEmits(['close', 'success'])

</script>

<style lang="scss" scoped></style>
