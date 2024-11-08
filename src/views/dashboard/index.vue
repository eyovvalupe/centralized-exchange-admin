<template>
  <div class="dashboard-container px-[30px] py-[20px]">
    <el-row :gutter="30" class="reset-el-style-v2">
      <el-col :span="16">
        <div class="index-card">
          <div class="flex justify-between index-card-header">
            <div class="font-title2 flex items-center">充值统计</div>
            <div class="flex items-center">
              <el-radio-group v-model="currLast" @change="changeSearch(currLast)">
                <el-radio-button :label="0">本月数据</el-radio-button>
                <el-radio-button :label="1">上月数据</el-radio-button>
              </el-radio-group>

              <el-date-picker
                class="ml-[10px]"
                v-model="timeRanges"
                type="daterange"
                range-separator="~"
                start-placeholder="请选择开始时间"
                end-placeholder="请选择结束时间"
                style="width: 400px"
                @change="changeSearch(2)"
              />
            </div>
          </div>
          <div class="flex items-center justify-between py-[40px] pr-[20px]">
            <div class="card-blue card-bg">
              <img class="group-img" src="../../assets/images/group-blue.png" alt="" />
              <div class="group-text">充值（USDT）</div>
              <div class="group-price">{{ totalInfo.deposit }}</div>
              <div class="group-btn">明细</div>
            </div>
            <div class="card-green card-bg">
              <img class="group-img" src="../../assets/images/group-green.png" alt="" />
              <div class="group-text">提现（USDT）</div>
              <div class="group-price">{{ totalInfo.withdraw }}</div>
              <div class="group-btn">明细</div>
            </div>
            <div class="card-orange card-bg">
              <img class="group-img" src="../../assets/images/group-orange.png" alt="" />
              <div class="group-text">充提差额（USDT）</div>
              <div class="group-price">{{ totalInfo.balance }}</div>
              <div class="group-btn">明细</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="index-card" v-if="isAdmin">
          <div class="flex justify-between index-card-header">
            <div class="font-title2 flex items-center">任务提醒</div>
          </div>
          <div class="px-[30px] pb-[20px]">
            <div
              class="rg-item flex justify-between items-center"
              @click="onShortCut(item)"
              v-for="item in shortCut"
              :key="item.name"
              :class="{ disabled: !checkAuthCode(item.auth) }"
            >
              <div class="rg-item-left flex items-center">
                <span>{{ item.text }}</span>
              </div>
              <div class="rg-item-rg">
                <div class="item-rg-price">{{ messageNumObj[item.badge] || 0 }}</div>
                <div class="item-rg-text">{{ item.name == 'notice' ? '未读消息' : '待处理' }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
export default { name: 'Dashboard' }
</script>
<script setup lang="ts">
import { getglobalTotal } from '/@/api/modules/base.api'
import { checkAuthCode } from '/@/hooks/store.hook.js'
import { useUserStore, useServiceStore } from '/@/store'
import { computed, ref, getCurrentInstance, watch } from 'vue'
import { ServiceChat } from '../layout/components/service/components/common/ServiceChat'
import { dayjs } from 'element-plus'
const useService = useServiceStore()
const Bus = getCurrentInstance().appContext.config.globalProperties.$mitt
Bus.on('update:dashboard', () => {})
const userStore = useUserStore()
const isAdmin = computed(() => !userStore.userInfo.role?.includes('agent'))
const userInfo = computed(() => userStore.userInfo)
const messageNumObj = computed(() => useService.messageNumObj)

const shortCut = ref([
  { name: 'RechargeOrder', badge: 'deposit', text: '充值订单', auth: '111' },
  { name: 'withdrawlOrder', badge: 'withdraw', text: '提现订单', notArrow: false, auth: '112' },
  { name: 'kycList', badge: 'kyc', text: '实名审核', notArrow: false, auth: '103' },
  { name: 'notice', badge: 'support', text: '客服消息', isDialog: true, notArrow: false, auth: '601' },
])

const currLast = ref(0)
const totalInfo = ref({
  deposit: '0',
  withdraw: '0',
  balance: '0',
})
const timeRanges = ref([])

const onShortCut = item => {
  Bus.emit('navbarShortCut', item)
}

const init = time_arr => {
  const send = { start_time: '', end_time: '', page: 1 }
  if (time_arr[0]) {
    send.start_time = dayjs(time_arr[0]).format('YYYY-MM-DD')
  }
  if (time_arr[1]) {
    send.end_time = dayjs(time_arr[1]).format('YYYY-MM-DD')
  }

  getglobalTotal(send).then(res => {
    totalInfo.value = res
  })
}

const changeSearch = num => {
  currLast.value = num
  let arr = []
  if (currLast.value == 0) {
    // 获取本月的开始时间
    const startOfMonth = dayjs().startOf('month')
    // 获取当前时间
    const currentTime = dayjs()
    arr = [startOfMonth, currentTime]
  } else if (currLast.value == 1) {
    // 获取上个月的开始时间
    const startOfLastMonth = dayjs().subtract(1, 'month').startOf('month')
    // 获取上个月的结束时间
    const endOfLastMonth = dayjs().subtract(1, 'month').endOf('month')
    arr = [startOfLastMonth, endOfLastMonth]
  } else {
    arr = timeRanges.value
  }
  timeRanges.value = arr
  init(arr)
}
changeSearch(0)
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;

  .font-title {
    font-size: 22px;
  }

  .font-title2 {
    font-size: 20px;
    font-weight: 600;
    color: #33353d;
  }

  .index-card {
    border: 1px solid #eff2f8;
    border-radius: 20px;
  }
  .index-card-header {
    height: 60px;
    border-bottom: 1px solid #eff2f8;
    padding: 0 20px 0 24px;
    position: relative;
    &::before {
      content: '';
      width: 10px;
      height: 28px;
      border-radius: 0px 10px 10px 0px;
      background: #4377fe;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -14px;
    }
  }

  .card-bg {
    width: 100%;
    height: 400px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
    border-radius: 20px;
    margin-left: 20px;
    padding: 0 30px;
    .group-img {
      margin-top: -20px;
      margin-left: -20px;
      height: 153px;
      margin-bottom: 30px;
    }

    .group-text {
      color: #33353d;
      font-size: 20px;
      font-weight: 400;
      line-height: 16px;
      text-align: left;
    }

    .group-price {
      color: #000000;
      font-size: 40px;
      font-weight: 600;
      line-height: 40px;
      text-align: left;
      font-family: Rubik;
      padding: 27px 0 43px 0;
    }

    .group-btn {
      width: 160px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      border-radius: 50px;
      opacity: 0px;
      color: #ffffff;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    }
  }

  .card-blue {
    background-image: url(../../assets/images/mask-blue.png);
    background-color: #d4dffc;
    .group-btn {
      background-color: #4377fe;
    }
  }

  .card-green {
    background-image: url(../../assets/images/mask-green.png);
    background-color: #d0f4e9;

    .group-btn {
      background-color: #17c290;
    }
  }

  .card-orange {
    background-image: url(../../assets/images/mask-orange.png);
    background-color: #ffe8e1;

    .group-btn {
      background-color: #f8734a;
    }
  }

  .rg-item {
    border-radius: 20px;
    background-color: #eff2f8;
    margin-top: 16px;
    height: 98px;
    overflow: hidden;
    cursor: pointer;
    .rg-item-left {
      position: relative;
      padding-left: 30px;
      &::before {
        content: '';
        width: 10px;
        height: 76px;
        background-color: #4377fe;
        border-radius: 10px;
        margin-right: 23px;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -38px;
      }

      span {
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        text-align: left;
        color: #33353d;
      }
    }

    .rg-item-rg {
      padding-right: 30px;
      line-height: 1;
      .item-rg-price {
        font-size: 30px;
        font-weight: 600;
        line-height: 35.55px;
        text-align: right;
        color: #f0383b;
        margin-bottom: 9px;
      }

      .item-rg-text {
        font-size: 16px;
        font-weight: 500;
        text-align: right;
        color: #65749c;
      }
    }

    &:active {
      background-color: #e7ecf7;
    }
  }
}
.rg-item.disabled {
  .rg-item-left {
    &::before {
      background-color: rgba(0, 0, 0, 0.1);
    }
    span {
      color: rgba(0, 0, 0, 0.3);
    }
  }
  .rg-item-rg {
    .item-rg-price {
      color: rgba(0, 0, 0, 0.4);
    }
    .item-rg-text {
      color: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
