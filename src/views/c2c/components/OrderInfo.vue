<template>
   <el-dialog :close-on-click-modal="false" width="700" class="reset-el-styte" title="订单详情" v-model="show" :append-to-body="true" @close="closeDialog">
    <div class="order-info">
      <div class="flex tab el-tabs__nav is-top w-100">
        <span class="el-tabs__item is-top" :class="activeName === 'first' ? 'is-active' : ''"
          @click="activeName = 'first'">{{ offsetObj[form.offset] || '卖出' }}</span>
        <span class="el-tabs__item is-top" :class="activeName === 'second' ? 'is-active' : ''"
          @click="activeName = 'second'">
          联系用户
          <b class="unread" v-if="form.unread">{{ form.unread }}</b>
        </span>
      </div>
      <el-tabs v-model="activeName" class="w-full">
        <el-tab-pane name="first" v-loading="loading">
          <!-- <div class="p-2 mt-2 flex justify-between">
            <div>{{ form.username }} <span class="status-bg" :class="form.offset">{{ offsetObj[form.offset] }}</span>
            </div>
            <div class="flex justify-center">
              <el-icon>
                <Clock />
              </el-icon>
              <div> <span class="status-bg" :class="form.status">{{ statusObj[form.status] }}</span> <b class="timer">{{
                formatSeconds(timerNumber)
              }}</b> ({{ form.endtime }}s) </div>
            </div>
          </div> -->
          <div class="my-2 bg-slate-50  border p-2">
            <div>
              <span class="avatar">
                {{ form.merchant_name ? form.merchant_name.slice(0, 1) : '' }}
              </span>
              <span> {{ form.merchant_name }}</span>
            </div>
            <small class="flex justify-between txt-gray">
              <span>成交量 {{ form.merchant_volume }} / 成交率{{
                form.merchant_volumerate }}% / 平均时效 {{ form.merchant_avetime }}分钟</span>
              <!-- <div class="flex">
                <el-icon>
                  <Clock />
                </el-icon>
                <span class="status-bg">平均时效 <b class="txt-yellow">{{ form.merchant_avetime }}</b> 分钟</span>
              </div> -->
            </small>
            <div class="txt-gray2 flex justify-between" style="font-size: 12px;">
              <span>下单时间 {{ form.date }}</span>
              <span>订单号 {{ form.order_no }}</span>
            </div>
          </div>
          <div class="border-box bg-slate-100 p-2 flex justify-between">
            <div class="border-right text-center w-4/12">
              <label>总价</label>
              <span><b class="txt-blue">{{ form.totalprice }}</b>{{ form.currency }}</span>
            </div>
            <div class="border-right text-center w-4/12">
              <label>价格</label>
              <span>{{ form.price }}</span>
              <span>{{ form.crypto }}</span>
            </div>
            <div class="text-center w-4/12">
              <label>数量</label>
              <span>{{form.volume}}</span>
            </div>
          </div>
          <div class="text-center cursor-pointer mt-0 mb-5 p-2 bg-slate-100 border border-dashed"
            style="border-radius: 10px;" @click="showDialog(form, 'showBankDialog')"
            v-if="form.bank_status == 'undone' && form.status.indexOf('wait') !== -1">
            <div class="text-center"> <img :src="addBank" style="display: inline-block;opacity: .8;">
            </div>
            <p style="line-height: 28px; margin-left: 10px;">设置银行卡</p>
          </div>
          <div class="text-center my-2" v-else-if="form.bank_status !== 'undone'">
            <div class="table-list flex flex-nowrap justify-between">
              <span>银行</span>
              <span class="w-8/12 text-left pl-5 cursor-pointer" @click="copy(form.bank_name)">
                {{ form.bank_name }} <el-icon>
                  <CopyDocument />
                </el-icon>
              </span>
            </div>
            <div class="table-list flex flex-nowrap justify-between">
              <span>卡号</span>
              <span class="w-8/12 text-left pl-5 cursor-pointer" @click="copy(form.bank_card_number)">
                {{ form.bank_card_number }} <el-icon>
                  <CopyDocument />
                </el-icon>
              </span>
            </div>
            <div class="table-list flex flex-nowrap justify-between">
              <span>姓名/账号</span>
              <span class="w-8/12 text-left pl-5 cursor-pointer" @click="copy(form.account_name)">
                {{ form.account_name }} <el-icon>
                  <CopyDocument />
                </el-icon>
              </span>
            </div>
          </div>
          <div class="bg-slate-50 p-2 border">
            <div v-if="form.status.indexOf('wait') !== -1">
            <div class="flex">
              <span style="line-height: 35px;"> {{ statusObj[form.status] }}</span> <b class="timer ml-2">
                {{formatSeconds(timerNumber) }}
                </b>
            </div>
            <p class="text-left">请根据总价，向用户提供的银行卡转账</p>
          </div>
          <div class="text-left" v-else>订单{{ statusObj[form.status] }}</div>
          </div>
          <!-- <div class="border-line mt-2"></div> -->
          <p class="dialog-footer flex justify-center p-5 pb-0">
            <el-button @click="handleSubmit('cancel')" class="mr-5"
              :disabled="isLoading || form.status.indexOf('wait') === -1" :loading="isLoading">取消订单</el-button>
            <el-button type="primary" class="default_btn ml-5"
              @click="handleSubmit(form.offset == 'buy' ? 'confirm' : 'payment')"
              :disabled="form.bank_status == 'undone' || (form.offset == 'buy' ? form.status !== 'waitconfirm':form.status !== 'waitpayment')" :loading="isLoading">{{
                form.offset == 'buy' ? '放行' : '我已付款'
              }} </el-button>
          </p>
        </el-tab-pane>
        <el-tab-pane name="second">
          <span class="tag-badge">{{ form.unread }}</span>
          <div class="chat-box" v-if="activeName === 'second'">
            <messageInterface />
            <sendMessage />
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>
    <template #footer></template>
  </el-dialog>
  <BankSet v-if="dialogType.showBankDialog" :data="dialogType.info" @close="closeDialogType" />
</template>

<script setup>
import { apiDetial, apiSetStatus } from '/@/api/modules/c2cOrder'
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import messageInterface from './common/messageInterface.vue'
import sendMessage from './common/sendMessage.vue'
import BankSet from './BankSet.vue'
import { ServiceChatC2C } from './common/ServiceChatC2C'
import { formatSeconds, copy } from '/@/utils'
import { useServiceStoreC2C } from '/@/store'
import addBank from '/@/assets/imgs/account.png'
const usec2cService = useServiceStoreC2C()

const props = defineProps({
  data: { // 行数据
    type: Object,
    default: () => ({})
  }
})
const timerNumber = ref(0)
const activeName = ref('first')
const offsetObj = {
  buy: '买入',
  sell: '卖出'
}
const statusObj = {
  'waitpayment': '等待用户付款',
  'waitconfirm': '等待商家确认',
  'done': '已完成',
  'cancel': '已取消'
}
const loading = ref(true)
const isLoading = ref(false)
const show = ref(true)
const form = reactive({
  partyid: '',
  username: '',
  uid: '',
  order_no: '',
  offset: '',
  crypto: '',
  currency: '',
  price: '',
  volume: '',
  totalprice: '',
  status: '',
  date: '',
  endtime: '',
  bank_status: ''
})
const getDataList = (callback) => {
  apiDetial({ order_no: props.data.order_no }).then(res => {
    for (const key in res) {
      if (res[key] !== null) {
        form[key] = res[key]
      }
    }
    timerNumber.value = res.endtime;
    loading.value = false;
    if(res.endtime && res.status.indexOf('wait')!==-1){
      callback && callback()
    }
  })
}
let timerIntval = null;
const timerFunc = () => {
  timerIntval = setInterval(() => {
    getDataList()
  }, 5000);
}
onUnmounted(() => {
  timerIntval && clearTimeout(timerIntval)
})
onMounted(() => {
  for (const key in form) {
    if (props.data && props.data[key] !== undefined) {
      form[key] = props.data[key]
    }
  }
  if (props.data && props.data.order_no) {
    // if (form.status.indexOf('wait') !== -1) {
    //   timerFunc();
    // } else {
    //   getDataList();
    // }
    getDataList();
    timerFunc()
    usec2cService.setMessageList([]);
    usec2cService.setOrderNo(props.data.order_no)
    ServiceChatC2C.init()
  }
})
const dialogType = reactive({
  showBankDialog: false,
  info: null
})
let timer;
const cutTimer = () => {
  timer = setInterval(() => {
    // console.log(timerNumber.value);
    if (timerNumber.value <= 0) {
      timer && clearInterval(timer)
    } else {
      timerNumber.value--
    }
  }, 1000);
}
cutTimer();
const emit = defineEmits(['close', 'success'])
const closeDialog = () => {
  timer && clearInterval(timer)
  emit('close', false)
}
const funcEvent = async (status) => {
  // 发送请求
  isLoading.value = true
  try {
    const send = { order_no: form.order_no, status };
    await apiSetStatus(send)
    ElMessage({
      type: 'tips',
      message: '操作成功',
      offset: 200
    })
    isLoading.value = false
    emit('close', { reload: true })
  } catch (error) {
    isLoading.value = false
  }
}
const handleSubmit = (status) => {
  if (status == 'cancel') {
    ElMessageBox.confirm('确定要取消订单吗？', '确定操作', {
      customClass: 'transTop320',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      funcEvent(status)
    }).catch(() => { })
  } else {
    funcEvent(status)
  }
}

const showDialog = (data, type) => {
  if (data) {
    dialogType.info = Object.assign({}, data);
  } else {
    dialogType.info = null
  }
  dialogType[type] = true;
}
const closeDialogType = (item) => {
  for (const key in dialogType) {
    dialogType[key] = false
  }
  if (item && item.reload) {
    getDataList();
  }
}
</script>
<style lang="scss" scoped>
.tag-badge {
  background: red;
  color: #fff;
  width: 30px;
  height: 30px;
  line-height: 30px;
  position: absolute;
  top: 0;
  right: 0;
}

.order-info {
  .chat-box {
    background: #fff;
  }

  .border-box {
    border: 1px solid #e3e3e3;
    border-radius: 5px;
    margin: 5px 0;

    .border-right {
      border-right: 1px solid #e3e3e3;
    }

    label {
      color: #999;
    }

    label {
      display: block;
    }
  }

  .el-icon {
    margin-top: 5px;
    margin-right: 3px;
  }

  .timer {
    display: block;
    font-size: 22px;
    color: red;
    // color: #FFCC00;
  }

  .avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #014CFA;
    display: inline-block;
    text-align: center;
    margin-right: 5px;
    color: #fff;
    font-size: 13px;
  }
}
</style>
