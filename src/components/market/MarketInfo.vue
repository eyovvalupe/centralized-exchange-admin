<!-- 市场详情 -->
<template>
    <div class="marketinfo" :class="{ 'marketinfo--full': fullWindow }">
      <!-- 头部 -->
      <div class="charts_header" v-if="fullWindow">
       
        <!-- 名字 -->
        <div class="charts_name">
            <div class="name" v-if="type == 'stock'">{{ item.symbol }}</div>
            <div class="name" v-else>{{ item.name }}</div>
            <div class="info">{{ showDate }}</div>
        </div>

        <!-- 涨跌 -->
        <div class="chatrs_ud" :class="item.ratio > 0 ? 'up' : 'down'">
            <span>{{ item.price }}</span>
            <div class="chatrs_ud_icon">
                <img v-show="item.ratio < 0" src="../../assets/charts/down.svg" alt="^" />
                <img v-show="item.ratio > 0" src="../../assets/charts/up.svg" alt="^" />
            </div>
        </div>

        <!-- 详情 -->
        <div
            class="charts_info"
        >
            <div class="charts_info_item">
            <div>24小时涨跌</div>
            <div class="num" :class="item.ratio > 0 ? 'up' : 'down'">
                {{
                (item.ratio || 0) > 0 ? "+" + (item.ratio || 0) : item.ratio || 0
                }}%
            </div>
            </div>
            <div class="charts_info_item">
                <div>金开</div>
                <div class="num">{{ item.open }}</div>
            </div>
            <div class="charts_info_item">
                <div>昨收</div>
                <div class="num">{{ item.close }}</div>
            </div>
            <div class="charts_info_item">
                <div>24小时最高价</div>
                <div class="num">{{ item.high }}</div>
            </div>
            <div class="charts_info_item">
                <div>24小时最低价</div>
                <div class="num">{{ item.low }}</div>
            </div>
            <div class="charts_info_item">
                <div>成交额</div>
                <div class="num">{{ _formatNumber(item.amount) }}</div>
            </div>
            <div class="charts_info_item">
                <div>成交量</div>
                <div class="num">{{ _formatNumber(item.volume) }}</div>
            </div>
            <!-- <div class="charts_info_item">
                        <div>市盈率</div>
                        <div class="num">23.54%</div>
                    </div> -->
        </div>

        <div style="flex: 1">
           
        </div>
        
     </div>
      <div class="info_header" v-else>
        <div class="top">
          <!-- 标题 -->
          <div class="title flex justify-between items-center">
            <div class="title_name">{{ item.name || "--" }}</div>
            <div>{{ item.symbol || "--" }}</div>
          </div>
        
          <!-- 详情 -->
         
        </div>
        <div class="header-price">
          <h1 class="info" :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">
            <template v-if="item.price || item.close">
              {{ item.price || item.close }}
            </template>
            <span v-else>--</span>
          </h1>
          <div style="display: flex; align-items: center; margin-left: 10px" class="ratio"
            :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']">
            <div class="ratio_price" v-if="item.price * (item.ratio || 0)">
              {{ updown === 0 ? "" : updown > 0 ? "+" : "" }}
              {{ item.price * (item.ratio || 0) }}
            </div>
            <div class="ratio_percentage" v-if="item.ratio">
              {{
                item.ratio === undefined
                  ? "--"
                  : item.ratio > 0 ? "+" + item.ratio + "%" : item.ratio + "%"
              }}
            </div>
          </div>
        
        </div>
      </div>
      <!-- 内容 -->
      <div class="market_content">
        <!-- 图表 -->
        <div class="chart_box">
            <div class="tabs-wrap flex justify-between">
                <div class="tabs">
                    <div class="tab" :class="{ active_tab: timeType == 'Time' }" @click="changeType('Time')">
                    Time
                    </div>
                    
                    <el-popover
                        placement="bottom"
                        :width="120"
                        trigger="hover"
                >
                        <div class="times_list">
                        <div v-for="item in minList" :key="item" @click="chooseTime(item)" class="item"
                            :class="{ active_item: currMin == item }">
                            {{ item }}
                        </div>
                        </div>
                        <template #reference>
                            <div class="tab" :class="{ active_tab: minList.includes(timeType) }">
                            {{ currMin }}
                            <el-icon ><CaretBottom /></el-icon>
                            </div>
                        </template>
                    </el-popover>
                    
                    <div class="tab" :class="{ active_tab: timeType == '1h' }" @click="changeType('1h')">
                    1h
                    </div>
                    <div class="tab" v-if="!['stocks', 'forex'].includes(type)" :class="{ active_tab: timeType == '4h' }"
                    @click="changeType('4h')">
                    4h
                    </div>
                    <!-- <div class="tab" :class="{ active_tab: timeType == '1D' }" @click="changeType('1D')">
                    1D
                    </div> -->
                    <div class="tab" :class="{ active_tab: timeType == '1W' }" @click="changeType('1W')">
                    1W
                    </div>
                    <div class="tab" :class="{ active_tab: timeType == '1M' }" @click="changeType('1M')">
                    1M
                    </div>
                    <div class="tab" v-if="!['stocks', 'forex'].includes(type)" :class="{ active_tab: timeType == '1Y' }"
                    @click="changeType('1Y')">
                    1Y
                    </div>
                </div>
                <div class="full-tab" @click="fullScreen(fullWindow ? false : true)">
                    <img src="../../assets/charts/full.svg" v-if="!fullWindow"  />
                    <img src="../../assets/charts/exit_full.svg" v-else />
                </div>
            </div>
          
          <div class="chart_container">
            <!-- 时区 -->
            <div v-if="showDate" class="chart_time">{{ showDate }}</div>
            <!-- 分时图 -->
            <AreaChart :type="type" ref="AreaChartRef" v-if="timeType == 'Time'" :showY="true" :symbol="symbol" />
            <!-- K线图 -->
            <KlineChart :type="type" ref="KlineChartRef" v-if="timeType != 'Time'" :symbol="symbol" :period="timeType" />
           
          </div>
        </div>
      </div>
     
  
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted, ref, watch } from "vue";
  import AreaChart from "../KlineCharts/AreaChart.vue";
  import KlineChart from "../KlineCharts/KlineChart.vue";
  import { _formatNumber } from "/@/utils/index";
  import { symbolBasic } from "/@/api/modules/base.api";
  import { formatTimestamp } from "/@/utils/index";
  import {CaretBottom} from '@element-plus/icons-vue'
  
  const props = defineProps({
    type: {
      type: String,
      default: "",
    },
    symbol:{
        type: String,
        default: "",
    }
  });
  
  // 股票信息
  const item = ref({})

  const showDate = computed(() => {
    const timestamp = new Date().getTime()
    // 展示的数据时间
    if (item.value.timestamp || item.value.ts || timestamp) {
      return formatTimestamp(
        item.value.timestamp || item.value.ts || timestamp,
        item.value.timezone
      );
    }
    return "";
  });
  
  const updown = computed(() => {
    // 1-涨 -1-跌 0-平
    if (item.value.ratio === undefined) return 0;
    return item.value.ratio > 0 ? 1 : -1;
  });
  
  // 获取股票最新信息
  if (props.symbol) {
    symbolBasic({ symbol: props.symbol }).then((data) => {
        if (data.symbol == props.symbol) {
          item.value = data
        }
    });
  }
  
  // 图表信息  Time 1m 5m 10m 15m 30m 1h 4h 1D 1W 1M 1Y
  const timeType = ref("1h");
  const showPicker = ref(false); // 时间选择弹窗
  const currMin = ref("1m");
  const minList = computed(() => {
    if (
      props.type == "futures" ||
      props.type == "aiquant" ||
      props.type == "constract"
    ) {
      return ["1m", "5m", "15m", "30m"];
    }
    return ["1m", "5m", "10m", "15m", "30m"];
  });
  const chooseTime = (time) => {
    showPicker.value = false;
    currMin.value = time;
    changeType(time);
  };
  const changeType = (type) => {
    if (timeType.value == type) return;
    timeType.value = type;
  };
  
  // 全屏
  const fullWindow = ref(false)
  const KlineChartRef = ref();
  const AreaChartRef = ref();
  const fullScreen = (val) => {
    fullWindow.value = val
    if (KlineChartRef.value) KlineChartRef.value.resetSize();
    if (AreaChartRef.value) AreaChartRef.value.resetSize();
  };
  

  </script>
  
  <style lang="scss" scoped>
  .marketinfo {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    height: calc(100% - 10px);
    .has_padding_x {
      padding: 0 15px;
    }
  
    .info_header {
  
      .top {
        display: flex;
        min-height: 50px;
        align-items: center;
        justify-content: space-between;
        position: relative;
        height: 44px;
        margin-bottom: 10px;
        border-bottom: 1px solid #ECECEC;
        .title {
          width: 100%;
          display: flex;
          overflow: hidden;
          font-size: 12px;
          line-height: 16px;
          font-weight: 400;
          color: #8f92a1;
          box-sizing: border-box;
          padding: 0 16px;
  
          .title_name {
            color: #061023;
            font-size: 16px;
            line-height: 21px;
            font-weight: 600;
          }
        }
  
      }
  
      .header-price {
        padding: 5px 15px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .info {
          align-items: center;
          margin: 0;
        }
      }
  
      .count {
        .count_item {
          color: #55555e;
          font-size: 12px;
          font-weight: 400;
          line-height: 18px;
  
          .txt {
            flex: none;
            display: block;
            width: 100%;
            color: #bbb;
          }
  
          .num {
            color: #000;
            margin-left: 5px;
          }
        }
  
        .flex10 {
          flex: 5;
        }
  
        .flex12 {
          flex: 6;
        }
      }
    }
  
    h1.info {
      font-size: 30px;
      line-height: 40px;
      font-weight: 600;
    }
  
    .submit {
      color: #fff;
      height: 40px;
      border-radius: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      z-index: 100;
      margin-right: 10px;
    }
  
    .btn-green {
      background: #18b762;
    }
  
    .btn-red {
      background: #f3485e;
    }
  
    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      vertical-align: middle;
      font-size: 30px;
      font-weight: 600;
      line-height: 40px;
    }
  
    .ratio {
      font-size: 20px;
      line-height: 25px;
    }
  
    .sell_key_open {
      transform: translateY(0);
  
      .sell_key {
        background-color: rgba(0, 0, 0, 0);
  
        .sell_key_icon {
          transform: rotate(0deg);
        }
      }
    }
  
    .ratio_price,
    .ratio_percentage {
      height: 28px;
      display: inline-flex;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      line-height: 0.42;
      margin-right: 10px;
      padding: 5px 12px;
      border-radius: 62px;
    }
  
    .up .ratio_price,
    .up .ratio_percentage {
      background: #00af701a;
    }
  
    .down .ratio_price,
    .down .ratio_percentage {
      background: #e53e001a;
    }
  
    .align-content {
      align-content: center;
    }
  
    .txt-center {
      text-align: center;
    }
  
    .icon-heyue {
      display: block;
      height: 30px;
    }
  
    .market_content {
      flex: 1;
      overflow: hidden;
  
      .info {
        display: flex;
        align-items: stretch;
        margin-top: 8px;
        margin-bottom: 15px;
  
        .left {
          .price {
            font-size: 45px;
            line-height: 53px;
            color: #55555e;
            margin-bottom: 6px;
          }
  
          .time {
            color: #55555e;
            font-size: 14px;
            line-height: 24px;
  
            span {
              color: #0f0f1b;
              margin-left: 10px;
            }
          }
        }
  
        .mid {
          flex: 1;
          margin-left: 18px;
          margin-right: 10px;
          color: #55555e;
          font-size: 18px;
          line-height: 24px;
        }
  
        .right {
          font-size: 12px;
          line-height: 24px;
          color: #818898;
          font-weight: 400;
  
          b {
            color: #0d0d12;
            font-weight: 700;
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
  
      .chart_box {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .tabs-wrap{
          padding: 0 15px;
        }
        .tabs {
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
  
          .tab {
            height: 24px;
            background-color: #eff6ff;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 15px;
            color: #0a54f9;
            font-size: 12px;
            font-weight: 400;
            margin-right: 5px;
            padding: 0 5px;
            min-width: 40px;
            cursor: pointer;
          }
  
          .active_tab {
            background-color: #014cfa;
            color: #fff;
          }
        }
  
        .full-tab {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-left: 10px;
          min-width: 24px;
        }
  
        .chart_container {
          height: calc(100% - 24px);
          width: 100%;
          padding: 0 14px;
          position: relative;
  
          .chart_time {
            position: absolute;
            display: flex;
            align-items: center;
            height: 19px;
            z-index: 999;
            top: 12px;
            left: 12px;
            color: #999;
            padding: 5px 8px;
            background: #00000080;
            border-radius: 8px;
            color: #fff;
            font-size: 11px;
            font-weight: 400;
            line-height: 11px;
          }
        }
  
        .fullscreen_container {
          position: fixed;
          z-index: 9999;
          width: 100vw;
          height: var(--app-height);
          top: 0;
          // left: 100vw;
          left: 0;
          background-color: #fff;
          // transform: rotate(90deg);
          // transform-origin: 0% 0%;
  
          .full_close {
            width: 20px;
            height: 20px;
            position: absolute;
            right: 20px;
            top: 20px;
            color: #000;
            font-size: 20px;
            z-index: 99999;
          }
        }
      }
    }
  
  }
  
  .times_list {
  
    .item {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #55555e;
      overflow: hidden;
      cursor: pointer;
        &:hover{
            color: #014cfa;
        }
    }
    
    .active_item {
      background-color: #f4f5f7;
      color: #014cfa;
    }
  }
  
  .marketinfo--full{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top:0;
    z-index: 1000;
    background-color: #fff;
    .market_content{
        .chart_box{
            .tabs-wrap{
                padding: 15px 36px;
                border-bottom: 1px solid #f3f3f3;
            }
            .tabs {
                padding: 0px;
                .tab{
                    min-width: 50px;
                }
            }
        }
    }
    
  }
  
  .charts_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 80px;
    border-bottom: 1px solid #eff3f8;
    padding: 0 36px;
    .charts_name {
      .name {
        color: #061023;
        font-size: 20px;
        line-height: 135%;
      }

      .info {
        color: #8f92a1;
        font-size: 14px;
        font-weight: 400;
        line-height: 135%;
      }
    }

    .chatrs_ud {
      display: flex;
      align-items: center;
      margin: 0 36px;
      font-size: 24px;
      font-weight: 600;
      line-height: 20px;

      .chatrs_ud_icon {
        margin-left: 4px;
        img{
            height:16px;
        }
      }
    }

    .charts_info {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .charts_info_item {
        color: #8f92a1;
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        margin: 10px 20px 10px 0;
        text-align: left;

        .num {
          color: #061023;
          font-size: 14px;
          font-weight: 400;
          line-height: 12px;
          margin-top: 15px;
        }
      }
    }

  }

  </style>
  