<template>
   <el-dialog :close-on-click-modal="false" width="700" class="reset-el-styte" title="充提货币详情" v-model="show" :append-to-body="true"
    @close="emit('close', false)">
    <div class="py-[10px] reset-el-style-v2"  v-loading="dialogLoading">
        <el-table :data="tableData" row-class-name="bg-one-row" border
          :class="tableData.length ? '' : 'noborder'" v-if="detailData.length">
          <el-table-column v-for="(item, index) in columnBase" :key="index" :min-width="item.minWidth" :label="item.label" align="center">
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
import { getAgentCurrency } from '/@/api/modules/business/agents.api'
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


const gw = (w)=>{
  return Math.round(1400/1920 * w)
}

const columnBase = ref([
    { prop: 'currency', label: '币种',minWidth:gw(165), align: 'center' },
    { prop: 'deposit', label: '充值',minWidth:gw(165), align: 'center' },
    { prop: 'withdraw', label: '提现',minWidth:gw(165), align: 'center' },
    { prop: 'balance', label: '充提差',minWidth:gw(165), align: 'center' },
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
