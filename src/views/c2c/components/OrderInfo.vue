<template>
   <el-dialog :close-on-click-modal="false" width="700" class="reset-el-styte" title="订单详情" v-model="show" :append-to-body="true" @close="closeDialog">
    <div class="order-info">
      <div class="flex tab is-top w-100 mt-[10px]">
        <span class="tab-item is-top" :class="activeName === 'first' ? 'active' : ''"
          @click="activeName = 'first'">{{ offsetObj[form.offset] || '卖出' }}</span>
        <span class="tab-item is-top" :class="activeName === 'second' ? 'active' : ''"
          @click="activeName = 'second'">
          联系用户
          <b class="unread" v-if="form.unread">{{ form.unread }}</b>
        </span>
      </div>
      <el-tabs v-model="activeName" class="w-full pt-[20px]">
        <el-tab-pane name="first" v-loading="loading">
          <div class="order-operate-wrap">
            <div class="flex justify-between order-operate-head" v-if="form.status.indexOf('wait') !== -1">
              <div class="flex">
                <span> {{ statusObj[form.status] }}</span>
                <b class="timer ml-2">
                  {{formatSeconds(timerNumber) }}
                 </b>
              </div>
              <div class="text-left">请根据总价，向用户提供的银行卡转账</div>
            </div>
            <div class="flex justify-center order-operate-head" v-else>
              <div class="status" :class="form.status == 'done' ? 'success' : form.status">{{ statusObj[form.status] }}</div>
            </div>
            <div class="pay-info">
              <div class="pay-info-head flex justify-between">
                <div class="flex items-center">
                  <span class="avatar">
                    {{ form.merchant_name ? form.merchant_name.slice(0, 1) : '' }}
                  </span>
                  <span class="pay-info-head__name"> {{ form.merchant_name }}</span>
                </div>
                <small class="flex justify-between items-center pay-info-head__right">
                  成交量 {{ form.merchant_volume }} <b class="s-line"></b> 成交率{{
                    form.merchant_volumerate }}%  <b class="s-line"></b> <img src="../../../assets/images/time.svg"/> {{ form.merchant_avetime }}分钟
                
                </small>
                
              </div>
              <div class="set-card flex items-center justify-center"
                style="border-radius: 10px;" @click="showDialog(form, 'showBankDialog')"
                v-if="form.bank_status == 'undone'">
                <el-button type="primary" class="w-[160px]" round><SvgIcon class="mr-[10px]" size="20px" color="#fff" name="card" />设置银行卡</el-button>
               
              </div>
              <div class="card-info" v-else-if="form.bank_status !== 'undone'">
                <div class="card-info-list">
                  <div class="card-info-item">
                    <span class="card-info-item__label">银行</span>
                    <span class="card-info-item__val">
                      {{ form.bank_name }}
                    </span>
                  </div>
                  <div class="card-info-split"></div>
                  <div class="card-info-item">
                    <span class="card-info-item__label">卡号</span>
                    <span class="card-info-item__val">
                      {{ form.bank_card_number }}
                      <span @click="copy(form.bank_card_number)" style="cursor: pointer;">
                        <el-icon color="#014CFA" class="ml-[5px]">
                          <CopyDocument />
                        </el-icon>
                      </span>
                    </span>
                  </div>
                  <div class="card-info-split"></div>
                  <div class="card-info-item">
                    <span class="card-info-item__label">账号</span>
                    <span class="card-info-item__val">
                      {{ form.account_name }}
                    </span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
          <div class="order-basic mt-[20px]">
            <div class="order-basic-head flex justify-between">
              <span class="flex items-center">
                {{ form.order_no }}
                <span class="ml-[5px] cursor-pointer"  @click="copy(form.order_no)">
                  <el-icon color="#014CFA">
                    <CopyDocument />
                  </el-icon>
                </span>
              </span>
              <span>{{ form.date }}</span>
            </div>
            <div class="order-basic-body flex justify-between">
              <div class="order-basic-item">
                <label>{{ form.totalprice }}</label>
                <span>总价({{ form.currency }})</span>
              </div>
              <div class="order-basic-item">
                <label>{{ form.price }}</label>
                <span>价格({{ form.crypto }})</span>
              </div>
              <div class="order-basic-item">
                <label>{{form.volume}}</label>
                <span>数量({{ form.currency }})</span>
              </div>
            </div>
          </div>

          <div class="flex justify-center pt-[40px] ml-[-20px]" v-if="form.status == 'waitpayment' || form.status == 'waitconfirm'">
            <div class="flex-1 ml-[20px]">
              <el-button type="danger" class="w-full" plain @click="handleSubmit('cancel')"
              :disabled="isLoading || form.status.indexOf('wait') === -1" :loading="isLoading">取消订单</el-button>
            </div>
            <div class="flex-1 ml-[20px]">
              <el-button type="primary" class="w-full"
              @click="handleSubmit(form.offset == 'buy' ? 'confirm' : 'payment')"
              :disabled="form.bank_status == 'undone' || (form.offset == 'buy' ? form.status !== 'waitconfirm':form.status !== 'waitpayment')" :loading="isLoading">{{
                form.offset == 'buy' ? '放行' : '我已付款'
              }} </el-button>
            </div>
          </div>
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
import { CopyDocument } from '@element-plus/icons-vue'
import SvgIcon from '/@/components/icons/Index.vue'
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
  'done': '交易完成',
  'cancel': '交易已取消'
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

.tab{
  height: 40px;
  background-color: #F5F7FC;
  display: flex;
  border-radius: 40px;
}
.tab-item{
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  cursor: pointer;
}
.tab-item.active{
  background-color: #014CFA;
  color:#fff;
  font-weight: 600;
  border-radius: 40px;
}

.order-operate-wrap{
  border: 1px solid #D0D8E2;
  background-color: #F5F7FC;
  border-radius: 16px;
}
.order-operate-head{
  line-height: 21px;
  padding: 14px 20px;
  .timer {
    font-size: 16px;
    color: #E8503A;
  }
  .status{
    font-size: 15px;
    font-weight: 600;
  }
}

.pay-info{
  background-color: #fff;
  border: 1px solid #D0D8E2;
  border-bottom: 0px;
  width: calc(100% + 2px);
  position: relative;
  left:-1px;
  border-radius: 16px;
}

.pay-info-head{
  padding: 10px 20px;
  align-items: center;
  min-height: 24px;
  border-bottom: 1px dashed #EFF3F8;
  &__name{
    color:#061023;
    font-size: 16px;
  }
  &__right{
    color:#8F92A1;
  }
}

.set-card{
  height: 140px;
}

.s-line{
  width: 0px;
  height: 12px;
  border-left:1px solid #8F92A1;
  margin: 0 6px;

}

.card-info{
  padding: 14px 20px;
}
.card-info-list{
  background-color: #F5F7FC;
  border-radius: 16px; 
}
.card-info-split{
  height: 4px;
  background-color: #fff;
}
.card-info-item{
  display: flex;
  height: 35px;
  &__label{
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 4px solid #fff;
  }
  &__val{
    flex:2;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}


.order-info {
  .chat-box {
    background: #fff;
  }
 
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #A7BEF4;
    text-align: center;
    margin-right: 10px;
    color: #014CFA;
    font-weight: 600;
    font-size: 12px;
    line-height: 24px;
  }
  :deep(.el-tabs__content){
    overflow: inherit;
  }
}

.order-basic{
  background-color: #F5F7FC;
  border-radius: 16px;
}
.order-basic-head{
  padding: 9px 20px;
  color:#8F92A1;
  border-bottom: 1px solid #EFF3F8;
  &__order_no{
    color:#666;
    font-size: 14px;
  }
}
.order-basic-body{
  padding: 18px 0 23px 0;
}
.order-basic-item{
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  line-height: 1;
  label{
    font-size: 16px;
    font-weight: 600;
    color:#061023;
  }
  span{
    color:#666D80;
    font-size: 14px;
    margin-top: 10px
  }
}
</style>
