<template>
  <div class="dashboard-container reset-el-styte p-2">
    <div class="flex justify-end p-2">
      <div></div>
      <div>
        <el-button :type="currLast == 0 ? 'success' : 'default'" @click="changeSearch(0)">本月</el-button>
        <el-button class="mr-5" :type="currLast == 1 ? 'success' : 'default'"
          @click="changeSearch(1)">上月</el-button>
        <el-date-picker v-model="timeRanges" type="daterange" range-separator="~" start-placeholder="请选择开始时间"
          end-placeholder="请选择结束时间" style="width: 280px;" @change="changeSearch(2)" />
      </div>
    </div>
    <!-- 数据卡片 -->
    <el-row :gutter="10" class="m-2">
      <el-col :span="8">
        <el-card shadow="never" class="card-bg-1">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-title2">充值</span>
            </div>
          </template>
          <div class="flex items-center justify-between">
            <div class="top-title text-right flex items-center">
              <span><img src="/@/assets/imgs/d-icon1.png" width="50"></span>
              <span class="font-title font-sans ml-3"> {{ totalInfo.deposit_main }}USDT</span>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]">
              <div>
                <p class="flex items-center"><span class="mr-2"><img src="/@/assets/images/USD.png"
                      width="20"></span><span>USD</span></p>
                <div>余额 <b>{{ totalInfo.deposit_usd }}</b>
                </div>
              </div>
              <div>
                <p class="flex items-center"><span class="mr-2"><img src="/@/assets/images/USDT.png"
                      width="20"></span><span>USDT</span></p>
                <div>余额 <b>{{ totalInfo.deposit_usdt }}</b>
                </div>
              </div>
              <div>
                <p class="flex items-center"><span class="mr-2"><img src="/@/assets/images/BTC.png"
                      width="20"></span><span>BTC</span></p>
                <div>余额 <b>{{ totalInfo.deposit_btc }}</b>
                </div>
              </div>
              <div>
                <p class="flex items-center"><span class="mr-2"><img src="/@/assets/images/ETH.png"
                      width="20"></span><span>ETH</span></p>
                <div>余额 <b>{{ totalInfo.deposit_eth }}</b>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" class="card-bg-2">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-title2">提现</span>
            </div>
          </template>
          <div class="flex items-center justify-between">
            <div class="top-title text-right flex items-center">
              <span><img src="/@/assets/imgs/d-icon2.png" width="50"></span>
              <span class="font-title font-sans ml-3"> {{ totalInfo.withdraw_main }}USDT</span>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mt-5 text-sm text-[var(--el-text-color-secondary)]">
              <div>
                <p class="flex items-center"><span class="mr-2"><img src="/@/assets/images/USD.png"
                      width="20"></span><span>USD</span></p>
                <div>余额 <b>{{ totalInfo.withdraw_usd }}</b>
                </div>
              </div>
              <div>
                <p class="flex items-center"><span class="mr-2"><img src="/@/assets/images/USDT.png"
                      width="20"></span><span>USDT</span></p>
                <div>余额 <b>{{ totalInfo.withdraw_usdt }}</b>
                </div>
              </div>
              <div>
                <p class="flex items-center"><span class="mr-2"><img src="/@/assets/images/BTC.png"
                      width="20"></span><span>BTC</span></p>
                <div>余额 <b>{{ totalInfo.withdraw_btc }}</b>
                </div>
              </div>
              <div>
                <p class="flex items-center"><span class="mr-2"><img src="/@/assets/images/ETH.png"
                      width="20"></span><span>ETH</span></p>
                <div>余额 <b>{{ totalInfo.withdraw_eth }}</b>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" class="card-bg-3">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-title2">充提差额</span>
            </div>
          </template>
          <div class="flex items-center justify-between">
            <div class="top-title text-right flex items-center">
              <span><img src="/@/assets/imgs/d-icon3.png" width="50"></span>
              <span class="font-title font-sans ml-3"> {{ totalInfo.balance }}USDT</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <template v-if="isAdmin">
      <ul class="py-2 dashboard menu-two flex text-sm">
        <li v-for="item in shortCut" :key="item.name" class="cursor-pointer flex items-center"
          @click="onShortCut(item)">
          <span class="px-2 mr-4 flex items-center" :class="activeName === item.name ? 'active' : ''">
            <span class="badge-box">
              <el-image :src="`/images/menus/${item.icon || item.name}.svg`" class="w-5 h-5 mr-1">
                <template #error>
                  <span class="image-slot"> </span>
                </template>
              </el-image>
              <span>{{ item.text }}</span>
              <el-badge :value="messageNumObj[item.badge]" v-if="messageNumObj[item.badge]"></el-badge>
            </span>
          </span>
        </li>
      </ul>
      <kyc @showUserDialog="userDialog" v-if="activeName === 'kycList'" />
      <whithdrawl @showUserDialog="userDialog" v-else-if="activeName === 'RechargeOrder'" />
      <deposit @showUserDialog="userDialog" v-else />
    </template>
    <template v-else>
      <el-row :gutter="10">
        <el-col :span="16">
          <div class="dashboard-title">我的代理</div>
          <agent @showUserDialog="userDialog" />
        </el-col>
        <el-col :span="8">
          <div class="dashboard-title">我的推荐码</div>
          <div class="tjcode-box">
             <span class="code-title">  {{ userInfo.uid || '无' }} </span>
          </div>
        </el-col>
      </el-row>
    </template>
    <div class="dashboard-title">安全日志</div>
    <safe :times="timeRanges" />
    <userDetail v-if="showDialog" :partyid="partyid" @close="closeDialogType" />
  </div>
</template>

<script lang="ts">
export default { name: 'Dashboard' };
</script>
<script setup lang="ts">
import { getglobalTotal } from '/@/api/modules/base.api'
import whithdrawl from './components/whithdrawl.vue'
import agent from './components/agent.vue'
import safe from './components/safe.vue'
import kyc from './components/kyc.vue'
import deposit from './components/deposit.vue'
import { useUserStore, useServiceStore } from '/@/store'
import userDetail from '/@/components/userDetail/index.vue'
import { computed, ref, getCurrentInstance, watch } from "vue";
import { dayjs } from 'element-plus'
const useService = useServiceStore()
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:dashboard', () => {
})
const userStore = useUserStore()
const isAdmin = computed(() => !userStore.userInfo.role?.includes('agent'))
const userInfo = computed(() => userStore.userInfo)
const messageNumObj = computed(() => useService.messageNumObj)
const activeName = ref('RechargeOrder')
const shortCut = ref([
  { name: 'RechargeOrder', icon: "RechargeOrder", badge: 'deposit', text: '充值订单', type: 'badge' },
  { name: 'DepositOrder', icon: "tx", badge: 'withdraw', text: '提现订单', type: 'badge', notArrow: false },
  { name: 'kycList', icon: "smrz", badge: 'kyc', text: '实名审核', type: 'badge', notArrow: false },
])
const showDialog = ref(false);
const currLast = ref(0);
const partyid = ref('');
const totalInfo = ref({});
const timeRanges = ref([])

const userDialog = (data) => {
  partyid.value = data.partyid;
  showDialog.value = true;
}
const closeDialogType = () => {
  showDialog.value = false;
  partyid.value = '';
}
const init = (time_arr) => {
  const send = { start_time: '', end_time: '', page: 1 };
  if (time_arr[0]) {
    send.start_time = dayjs(time_arr[0]).format('YYYY-MM-DD')
  }
  if (time_arr[1]) {
    send.end_time = dayjs(time_arr[1]).format('YYYY-MM-DD')
  }
  // Promise.all([getglobalDate({ page: 1 }), getglobalTotal({ page: 1 }), getagentList({ page: 1 })]).then(res => {
  getglobalTotal(send).then(res => {
    totalInfo.value = res;
  })
}
const onShortCut = (item) => {
  activeName.value = item.name;
}
const changeSearch = (num) => {
  currLast.value = num;
  let arr = [];
  if (currLast.value == 0) {
    // 获取本月的开始时间
    const startOfMonth = dayjs().startOf('month');
    // 获取当前时间
    const currentTime = dayjs();
    arr = [startOfMonth, currentTime]
  } else if (currLast.value == 1) {
    // 获取上个月的开始时间
    const startOfLastMonth = dayjs().subtract(1, 'month').startOf('month');
    // 获取上个月的结束时间
    const endOfLastMonth = dayjs().subtract(1, 'month').endOf('month');
    arr = [startOfLastMonth, endOfLastMonth]
  } else {
    arr = timeRanges.value;
  }
  timeRanges.value = arr
  init(arr);
}
changeSearch(0);
</script>


<style lang="scss" scoped>
.dashboard-container {
  position: relative;

  .dashboard-title {
    font-size: 15px;
    margin: 10px 5px;
  }
  .tjcode-box{
    background: #f5f5f5;
    height: 90%;
    border-radius: 10px;
    position: relative;
    .code-title{
      width: 100%;
      font-size: 22px;
      text-align: center;
      position: absolute;
      // left: 10px;
      // right: 0;
      // bottom: 0;
      top: 30px;
      // margin: auto;
    }
  }

  .font-title {
    font-size: 22px;
  }

  .font-title2 {
    font-size: 16px;
    color: #666;
  }

  .el-card {
    height: 200px;
    border: none;
    border-radius: 10px;
  }

  .card-bg-1 {
    background: #f1f7ff;
  }

  .card-bg-2 {
    background: #fff7e0;
  }

  .card-bg-3 {
    background: #ffeee1;
  }
}
</style>
