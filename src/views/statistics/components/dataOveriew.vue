<template>
    <div class="flex total-data-wrap reset-el-style-v2">
        <div class="w-3/12  py-[30px] px-[20px]">
            <div class="title-head"><img class="title-head__icon" src="../../../assets/images/wallet.svg"/>充提差额(USDT)</div>
            <div class="amount">{{allTotal.balance > 0 ? '+' : ''}}{{ allTotal.balance }}</div>
            <el-button type="primary" class="w-[140px] mt-[20px]" @click="emit('openDetail')" plain>充提货币详情</el-button>
        </div>
        <div class="w-9/12">
            <div class="flex">
                <div class="charts-data w-0 flex-1">
                    <div class="charts-data-title">
                        <span class="charts-data-title__name">充值总额(USDT)</span>
                        <span class="charts-data-title__val">{{ allTotal.deposit }}</span>
                    </div>
                    <div class="charts-data-cont flex">
                        <div class="charts-data__charts">
                            <div class="charts-data__charts_name">充值</div>
                            <pie-chart class="w-[170px] h-[170px] mt-[-25px] ml-[-25px]" series-name="充值" :data="depositData" v-if="depositData.length" :color="color" />
                        </div>
                        <div class="charts-data-items flex-1">
                            <div class="charts-data-item flex justify-between items-center" v-for="(item,index) in coinList" :key="item.currency">
                                
                                <div class="charts-data-item__name flex items-center">
                                    <i class="charts-data-item__dot" :style="{backgroundColor:item.color}"></i>
                                    <img class="w-[16px] h-[16px] mr-[6px] rounded-full" :src="`/images/crypto/${item.currency.toLocaleUpperCase()}.png`" :alt="item.currency.toLocaleUpperCase()" />
                                    {{ item.currency.toLocaleUpperCase() }}
                                </div>
                                <div class="charts-data-item__r">
                                    <strong>{{item.deposit_usdt}}</strong>
                                    <span>({{item.deposit_ratio }}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="charts-data w-0 flex-1">
                    <div class="charts-data-title">
                        <span class="charts-data-title__name">提现总额(USDT)</span>
                        <span class="charts-data-title__val">{{ allTotal.withdraw }}</span>
                    </div>
                    <div class="charts-data-cont flex">
                        <div class="charts-data__charts">
                            <div class="charts-data__charts_name">提现</div>
                            <pie-chart class="w-[170px] h-[170px] mt-[-25px] ml-[-25px]" series-name="提现" :data="withdrawData" v-if="withdrawData.length" :color="color" />
                        </div>
                        <div class="charts-data-items flex-1">
                            <div class="charts-data-item flex justify-between items-center" v-for="(item,index) in coinList" :key="item.currency" v-show="index < 6">
                                <div class="charts-data-item__name flex items-center">
                                    <img class="w-[16px] h-[16px] mr-[6px] rounded-full" :src="`/images/crypto/${item.currency.toLocaleUpperCase()}.png`" :alt="item.currency.toLocaleUpperCase()" />
                                    {{ item.currency.toLocaleUpperCase() }}
                                </div>
                                <div class="charts-data-item__r">
                                    <strong>{{item.withdraw_usdt}}</strong>
                                    <span>({{item.withdraw_ratio }}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import pieChart from './pieChart'
const props = defineProps({
    allTotal:{
        type:Object,
        default:()=>{}
    },
    coinList:{
        type:Array,
        default:()=>[]
    }
})

const emit = defineEmits(['openDetail'])

const color = computed(()=>{
    const data = []
    props.coinList.map(v=>{
        data.push(v.color)
    })
   return data
})

const withdrawData = computed(()=>{
    const data = []
    props.coinList.map(v=>{
        data.push({
            name:v.currency.toLocaleUpperCase(),
            value:v.withdraw
        })
    })
    return data
})

const depositData = computed(()=>{
    const data = []
    props.coinList.map(v=>{
        data.push({
            name:v.currency.toLocaleUpperCase(),
            value:v.deposit
        })
    })
   return data
})


</script>

<style lang="scss">
.total-data-wrap{
    border: 1px solid #ECECEC;
    border-radius: 16px;
    padding: 10px 0;
    margin-top: 10px;
}
.title-head{
    display: flex;
    align-items: center;
    height: 22px;
    color:#000;
    align-items: center;
    font-size: 16px;
    &__icon{
        margin-right:5px;
    }
}

.amount{
    font-size: 28px;
    color:#03BC59;
    line-height: 39px;
    margin-top: 10px;
}


.charts-data{
    border-left: 1px solid #ECECEC;
    padding: 0 20px;
}
.charts-data-title{
    display: flex;
    justify-content: space-between;
    height: 40px;
    border-bottom: 1px solid #ECECEC;
   
    &__name{
        display: flex;
        align-items: center;
        font-size: 14px;
        color:#000;
    }
    &__val{
        font-size: 20px;
        color:#000;
        font-weight: 600;
    }
    
}
.charts-data-cont{
    padding: 20px 0 10px 0;
}
.charts-data__charts{
    height: 120px;
    width: 120px;
    position: relative;
}
.charts-data__charts_name{
    position: absolute;
    top:50%;
    left:0;
    font-size: 14px;
    width: 100%;
    text-align: center;
    line-height: 20px;
    margin-top: -10px;
    color:#666;
}
.charts-data-items{
    padding-left: 20px;
}
.charts-data-items::after{
    content: '';
    display: block;
    clear: both;
}
.charts-data-item{
    width: 50%;
    float: left;
    height: 40px;
    padding-left: 20px;
    box-sizing: border-box;
    &__dot{
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 10px;
        background-color: #ccc;
        border-radius: 50%;
    }
    &__name{
        font-size: 14px;
        color:#000;
    }
    &__r{
        strong{
            font-size: 14px;
            color:#000;
        }
        span{
            color:#666;
            margin-left: 3px;
        }
    }
}
</style>