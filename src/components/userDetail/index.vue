<template>
   <el-dialog :close-on-click-modal="false" width="700" class="reset-el-styte" :title="`${detailData.username || ''}个人详细信息`" v-model="show"
    :append-to-body="true" @close="emit('close', false)">
    <div v-loading="dialogLoading" style="min-height: 400px;" class="mt-[10px]">
      <template v-if="!dialogLoading">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="财务数据" name="first">
            <div class="border p-[20px] bg-slate-50">
              <div class="flex search-box">
                <el-date-picker
                  class="search-date-picker"
                  v-model="daterange"
                  type="daterange"
                  start-placeholder="请选择开始时间"
                  end-placeholder="请选择结束时间"
                  range-separator="至"
                  format="YYYY-MM-DD"
                  date-format="YYYY/MM/DD"
                  @change="daterangeChange"
                />
                <el-button type="primary" class="rounded-[8px] ml-[10px] w-[80px]" @click="handleSearch"> 查询 </el-button>
              </div>
              <div class="text-sm mt-[20px] mb-[10px]" style="color:#000;">充提合计(USDT)</div>
              <div v-for="(item, index2) in columnBase" :key="index2"
                class="table-list flex flex-nowrap justify-between">
                <span class="text-center">{{ item.label }}</span>
                <span class="w-7/12 text-center" style="color:#000;">{{ detailData.fund[item.prop] }}</span>
              </div>
            </div>
            <div class="flex mt-[20px]">
              <div class="w-7/12">
                <div class="flex mb-[5px]">
                <div class="text-sm mt-1" style="color:#000;">业务账户</div>
              </div>
                <div style="color:#000;">
                  <div class="table-list flex flex-nowrap justify-between bg-slate-50">
                    <span class="w-4/12 text-center">账户</span>
                    <span class="w-4/12 text-center" style="border-right: 1px solid #e6e6e6;">货币</span>
                    <span class="w-8/12 text-center">金额</span>
                  </div>
                  <div v-for="child in detailData.fund['account']" :key="child.currency"
                    class="table-list flex flex-nowrap justify-between">
                    <span class="w-4/12 text-center" style="font-weight: normal;">{{ options[child.account] }}</span>
                    <span class="w-4/12 text-center" style="border-right: 1px solid #e6e6e6;">{{ child.name }}</span>
                    <span class="w-8/12 text-center">{{ child.amount }}</span>
                  </div>
                </div>
              </div>
              <div class="w-5/12 ml-2">
              <div class="flex justify-between mb-[5px]">
                <div class="text-sm mt-1" style="color:#000;">现金账户</div>
                <div>
                  <span class="mr-2 text-xs">隐藏0余额</span>
                  <el-switch v-model="showZreo" size="small" />
                </div>
              </div>
              <div class="table-list flex flex-nowrap justify-between bg-slate-50" style="color:#000;">
                <span class="w-4/12 text-center">货币</span>
                <span class="w-7/12 text-center">金额</span>
              </div>
              <template v-for="child in detailData.fund['wallet']" :key="child.currency">
                <div class="table-list flex flex-nowrap justify-between" v-if="!(showZreo && child.amount == 0)" style="color:#000;">
                  <span class="text-center">{{ child.name }}</span>
                  <span class="w-7/12 text-center">{{ child.amount }}</span>
                </div>
              </template>

            </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="基础数据" name="second">
            <div v-for="(item, index) in columnInfo" :key="index" class="table-list flex flex-nowrap justify-between">
              <span class="w-4/12 bg-slate-50">{{ item.label }}</span>
              <span class="w-8/12" v-if="item.prop === 'kyc'">
                <span class="status-bg" style="padding:4px 10px;border-radius:4px;" :class="detailData.base[item.prop] == 0 ? 'status-yellow' : 'lock'">
                  {{ ['未实名', 'L1认证', 'L2认证'][detailData.base[item.prop]] }}
                </span>
              </span>
              <span class="w-8/12" v-else-if="item.prop === 'limit'">
                <span class="status-bg" style="padding:4px 10px;border-radius:4px;" :class="detailData.base[item.prop] ? 'status-yellow' : 'status-green'">
                  {{ detailData.base['limit'] ? detailData.base['limit'] : '未限制' }}
                </span>
              </span>
              <span class="w-8/12" v-else-if="item.prop === 'role'">
                {{ roleName(detailData.base[item.prop]) }}
              </span>
              <span class="w-8/12" v-else>
                <div class="status" v-if="item.prop === 'locked'"
                  :class="!detailData.base[item.prop] ? '' : 'status-yellow'">
                  {{ detailData.base[item.prop] ? '限制' : '正常' }}
                </div>
                <div class="status" v-else
                  :class="detailData.base[item.prop] || detailData.base[item.prop] == null ? '' : 'status-yellow'">
                  {{ typeof (detailData.base[item.prop]) === 'boolean' ? (detailData.base[item.prop] ? '正常' : '限制') :
                    detailData.base[item.prop] }}
                </div>
              </span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { apiUser, apiUserFunds } from '/@/api/modules/business/player.api'
import { getGlobalWalletList } from '/@/api/modules/base.api'
import { dayjs } from 'element-plus'
const detailData = reactive({ base: {}, fund: {} })
const show = ref(true)
const showZreo = ref(true)
const activeName = ref('first')
const dialogLoading = ref(false)
const props = defineProps({
  partyid: { // 弹窗类型
    type: String,
    default: ''
  }
})
const searchForm = reactive({
  start_time: '',
  end_time: ''
})
const daterange = ref([])
const daterangeChange = (val)=>{
  if(val[0]){
    searchForm.start_time = val[0]
  }
  if(val[1]){
    searchForm.end_time = val[1]
  }
}
const options = {
  money: '现金账户',
  stock: '股票账户',
  futures: '合约账户',
  forex: '外汇账户'
}
const roleOptions = [
  {
    value: 'all',
    label: '所有用户',
  },
  {
    value: 'user',
    label: '真实用户',
  },
  {
    value: 'guest',
    label: '模拟用户',
  }
]
const roleName = (key) => {
  const obj = roleOptions.find(f => f.value === key);
  return obj ? obj.label : ''
}
const disabledStart = (time) => {
  return time.getTime() >= Date.now()
}
const disabledEnd = (time) => {
  return time.getTime() < Date.now()
}
// const columnWallet = reactive([
//   { prop: 'main', label: '交易账户', width: 120, align: 'center' },
//   { prop: 'USD', label: '美元', width: 100, align: 'center' },
//   { prop: 'USDT', label: 'USDT', width: 100, align: 'center' },
//   { prop: 'BTC', label: 'BTC', width: 100, align: 'center' },
//   { prop: 'ETH', label: 'ETH', width: 100, align: 'center' },
// ])
const columnInfo = ref([
  { prop: 'uid', label: 'UID', width: 100, align: 'center' },
  { prop: 'username', label: '用户名', width: 130, align: 'center' },
  { prop: 'father_username', label: '代理', width: 90, align: 'center' },
  { prop: 'role', label: '角色', width: 90, align: 'center' },
  { prop: 'kyc', label: '实名认证', width: 90, align: 'center' },
  { prop: 'limit', label: '流水限制' },
  { prop: 'enabled', label: '业务权限', width: 90, align: 'center', type: 'boolean' },
  { prop: 'withdauth', label: '提现权限', width: 90, align: 'center', type: 'boolean' },
  { prop: 'locked', label: '登录权限', width: 90, align: 'center', type: 'boolean' },
  { prop: 'created', label: '注册时间', width: 180, align: 'center' },
  { prop: 'lastlogin', label: '最后登录', width: 180, align: 'center' },
  { prop: 'remarks', label: '备注', align: 'center' },
])
const columnBase = ref([{ prop: 'deposit', label: '充值总额', width: 120, align: 'center' },
{ prop: 'withdraw', label: '提现总额', width: 120, align: 'center' },])
const getBaseInfo = (key) => {
  apiUser({ partyid: props.partyid }).then(res => {
    detailData.base = res;
  })
}
const handleSearch = () => {
  dialogLoading.value = true
  const send_obj = { partyid: props.partyid };
  if (searchForm.start_time) {
    send_obj.start_time = dayjs(searchForm.start_time).format('YYYY-MM-DD')
  }
  if (searchForm.end_time) {
    send_obj.end_time = dayjs(searchForm.end_time).format('YYYY-MM-DD')
  }
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
getBaseInfo();
const emit = defineEmits(['close', 'success'])
</script>
