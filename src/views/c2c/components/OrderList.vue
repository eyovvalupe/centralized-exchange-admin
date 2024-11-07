<template>
    <div class="order-list">
        <div class="w-3/12 order-item-w float-left" v-for="(item,i) in tableData" :key="i">
          <div class="order-item">
            <div class="order-item-hover">
              <el-button  :type="item['status'] !== 'done' && checkAuthCode(12101) ? 'primary' : ''"
              :disabled="!checkAuthCode(12101)" @click="showDialog(item, 'showOrderInfo')" class="w-[120px] underline">查看订单</el-button>
            </div>
            <div class="flex order-item-bt">
              <div class="order-item-left">
                UID:{{item.uid}}
              </div>
              <div class="order-item-right">
                <div class="flex justify-between">
                  <div>{{item.order_no}}</div>
                  <div class="status" :class="item.status == 'waitpayment' || item.status == 'waitconfirm' ? 'blue' : item.status">{{ statusObj[item.status] }}</div>
                </div>
              </div>
            </div>
            <div class="flex">
              <div class="order-item-left">
                <div class=" leading-[14px]">用户名</div>
                <div class="mt-[6px] leading-[14px]"><span class="cursor-pointer text-[#4377FE] underline" @click="showDialog(item, 'showInfoDialog')">{{ item.username }}</span></div>
              </div>
              <div class="order-item-right">
                <div class="flex justify-between">
                  <div>
                    <div class="order-item-right__buy leading-[16px] flex items-center">{{item.offset == 'buy' ? '买入' : '卖出'}} {{item.crypto}}<img class="w-[16px] h-[16px] ml-[6px] rounded" :src="`/images/crypto/${item.crypto.toUpperCase()}.png`" :alt="item.crypto.toUpperCase()"></div>
                    <div class="mt-[10px] leading-[14px]">价格 {{item.price}} {{item.currency}}</div>
                    <div class="mt-[6px] leading-[14px]">数量 {{item.volume}} {{item.crypto}}</div>
                  </div>
                  <div  class="order-item-right__amount">{{item.offset == 'buy' ? '-' : '+'}}{{item.totalprice}} <span>{{item.currency}}</span></div>
                </div>
              </div>
            </div> 
            
          </div>
        </div>

    </div>
</template>

<script setup>
import { checkAuthCode } from '/@/hooks/store.hook.js'
const props = defineProps({
    showDialog:Function,
    tableData:{
        type:Array,
        default(){
            return []
        }
    }
})

const statusObj = {
  'waitpayment': '待付款',
  'waitconfirm': '待确认',
  'done': '已完成',
  'cancel': '已取消'
}

</script>
<style lang="scss" scoped>
.order-list{
  margin-left: -20px;
}
.order-item{
  background-color: #F5F7FC;
  border-radius: 16px;
  position: relative;
  margin:10px 0 10px 20px;
  overflow: hidden;
}
.order-item-left,
.order-item-right{
  color:#666D80;
  padding: 10px 16px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.order-item-left{
  width: 30%;
  border-right: 1px solid #ECECEC;
  box-sizing: border-box;
}
.order-item-right{
  flex: 1;
  &__buy{
    font-size: 16px;
    font-weight: 600;
    color:#061023;
  }
  &__amount{
    font-size: 18px;
    color:#061023;
    font-weight: 600;
    display: flex;
    align-items: center;
    span{
      font-size: 12px;
      margin-left: 5px;
      font-weight: normal;
      position: relative;
      color:#121826;
    }
  }
}
.order-item-bt{
  border-bottom: 1px solid #ECECEC;
}

.order-item-hover{
  position: absolute;
  width: 100%;
  left:0;
  height: 100%;
  background-color: rgba(0,0,0,0.35);
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: .3s;
}
.order-item:hover .order-item-hover{
  opacity: 1;
}

@media screen and (max-width:1680px) {
  .order-item-w{
    width: 33.3% !important;
  }
}
</style>