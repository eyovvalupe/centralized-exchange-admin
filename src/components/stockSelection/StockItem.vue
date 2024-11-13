<!-- 股票单个元素 -->
<template>
  <div
    ref="root"
    style="width: 100%"
    :class="props.marketType != 'crypto' ? '' : 'mt-[10px]'"
  >
    
      <div
        :class="
          props.marketType == 'crypto'
            ? 'bg-[#F5F7FC] cursor-pointer rounded-[16px] pb-3 overflow-hidden '
            : 'cursor-pointer'
        "
        @click="goInfo(props.item.type)"
      >
        <div
          :class="
            props.marketType != 'crypto' ? 'stock_item' : 'stock_item_crypto'
          "
        >
          <div class="td5" v-show="props.marketType != 'crypto'">
            <div class="item_name flex items-center gap-1">
              <span v-show="item.type == 'stock'">{{ props.item.symbol }}</span>
              <span v-show="item.type == 'crypto'">{{ props.item.name }}</span>
              <div
                :class="`${
                  marketStyle[props.item.type]
                } font-normal text-[11px] ml-[3px] flex items-center justify-center rounded-[4px] w-[30px] h-[16px] `"
              >
                {{ market[props.item.type] }}
              </div>
            </div>
            <div class="item_info" v-show="props.item.type != 'crypto'">
              {{ props.item.name || "--" }}
            </div>
            <div
              class="text-[#0A54F9] text-[12px] w-[32px] h-[16px] rounded-[12px] border mt-[8px] items-center flex justify-center border-[#0A54F9]"
              v-show="props.item.type == 'crypto'"
            >
              {{ props.item.lever }}X
            </div>
          </div>
          <div class="td5" v-show="marketType == 'crypto'">
            <div class="item_name flex items-center gap-1">
              {{ props.item.name }}
              <div
                class="text-[#0A54F9] border-[1px] font-normal text-[10px] flex items-center justify-center rounded-[8px] w-[32px] h-[16px] ml-[3px] border-[#0A54F9]"
              >
                {{ props.item.lever }}X
              </div>
            </div>
          </div>
          <div
            :class="
              props.marketType != 'crypto'
                ? 'td2 spark_line_box'
                : 'td2 ml-[100px]'
            "
          >
            <SparkLine
              v-if="props.points"
              :style="
                props.marketType != 'cryto'
                  ? 'width: 100%; height: 30px;'
                  : 'width: 100%; height: 27px;'
              "
              :points="props.points"
              :ratio="props.item.ratio"
            />
          </div>
          <div class="td2 td_r" v-show="props.marketType != 'crypto'">
            <div
              class="item_num"
              :class="[updown === 0 ? '' : updown > 0 ? 'up' : 'down']"
            >
              {{ props.item.price ? fixLittleNum(props.item.price, 2) : "--" }}
            </div>
            <div
              class="item_info_box"
              @click.stop="() => (mode = mode == 3 ? 1 : mode + 1)"
            >
              <div
                v-if="props.item.ratio !== undefined"
                class="item_percent"
                :class="[updown === 0 ? '' : updown > 0 ? 'up_bg' : 'down_bg']"
              >
                <span v-if="mode == 1"
                  >{{
                    (props.item.ratio || 0) * 100 > 0
                      ? "+" + ((props.item.ratio || 0) * 100).toFixed(2)
                      : ((props.item.ratio || 0) * 100).toFixed(2)
                  }}%</span
                >
                <span v-else-if="mode == 2">{{
                  props.item.price || 0 > 0
                    ? "+" + (props.item.price || 0).toFixed(2)
                    : (props.item.price || 0).toFixed(2)
                }}</span>
                <span v-else>{{ _formatNumber(props.item.volume) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 为了显示自选给了常数，需要更改为后端数据 -->
        <div
          class="flex items-center justify-between text-[16px] font-bold w-[100%]"
          v-show="props.marketType == 'crypto'"
        >
          <div class="text-center w-1/3">
            <span :class="updown === 0 ? '' : updown > 0 ? 'up' : 'down'">{{
              fixLittleNum(item.price, 6) || "--"
            }}</span
            ><br />
            <span class="text-[11px] text-[#8F92A1] font-normal"
              >最新价</span
            >
          </div>
          <div class="text-center border-x-[#eff3f8] border-x-2 w-1/3">
            <span :class="updown === 0 ? '' : updown > 0 ? 'up' : 'down'">{{
              fixLittleNum(item.change, 6) || "--"
            }}</span
            ><br />
            <span class="text-[11px] text-[#8F92A1] font-normal">涨跌</span>
          </div>
          <div class="text-center w-1/3">
            <span :class="updown === 0 ? '' : updown > 0 ? 'up' : 'down'"
              >{{ item.ratio > 0 ? "+" : ""
              }}{{ ((item.ratio || 0) * 100).toFixed(2) }}%</span
            ><br />
            <span class="text-[11px] text-[#8F92A1] font-normal"
              >涨跌比</span
            >
          </div>
        </div>
      </div>

  </div>
</template>

<script setup>
import SparkLine from "./SparkLine.vue";
import { ref, computed, watch, onMounted } from "vue";
import { _formatNumber,fixLittleNum } from "/@/utils/index";

const market = {
  stock: "股票",
  crypto: "合约",
  forex: "外汇",
};
const marketStyle = {
  stock: "text-[#014CFA] bg-[rgba(1,76,250,0.1)] ",
  crypto: "text-[#FFAF2A] bg-[rgba(255,175,42,0.1)] ",
  forex: "text-[#18B762] bg-[rgba(24,183,98,0.1)] ",
};
const emits = defineEmits(["remove"]);
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  points:String,
  handleClick: {
    type: Function,
    default: null,
  },
  marketType: {
    type: String,
  }
});

const mode = ref(1);
const updown = computed(() => {
  // 1-涨 -1-跌 0-平
  if (props.item.ratio === undefined) return 0;
  return props.item.ratio > 0 ? 1 : -1;
});
const price = computed(() => props.item.price | 0);

const updownStatus = ref("");
watch(price, (newVal, oldVal) => {
  if (newVal && oldVal) {
    if (newVal > oldVal) {
      // 上升
      updownStatus.value = "up";
    } else {
      // 下降
      updownStatus.value = "down";
    }
    setTimeout(() => {
      updownStatus.value = "";
    }, 1000);
  }
});

const goInfo = () => {
  if (props.handleClick) return props.handleClick(props.item);
  
};

</script>

<style lang="scss" scoped>

.stock_item {
  display: flex;
  align-items: center;
  height:62px;
  position: relative;
  padding: 0 6px;
  &::after {
    content: "";
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    background-color: #eff3f8;
  }

  .td5 {
    flex: 5;
    flex-shrink: 0;
    overflow: hidden;

    .item_name {
      font-size: 16px;
      color: #061023;
      line-height: 16px;
      font-weight: 600;
    }

    .item_info {
      font-size: 12px;
      line-height: 16px;
      color: #8f92a1;
      margin-top:8px;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
    }
  }

  .td2 {
    flex-shrink: 0;
    flex: 2;
    overflow: hidden;

    .item_num {
      font-size: 15px;
      font-weight: 600;
      line-height: 15px;
      color: #6c7b90;
    }

    .item_info_box {
      margin-top: 5px;
      .item_percent {
        text-align: center;
        width: 50px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        display: inline-block;
        font-weight: 600;
        color: #fff;
        border-radius: 6px;
      }

      .nodata_percent {
        background-color: #6c7b90;
      }
    }
  }

  .td_r {
    text-align: right;
  }

  .spark_line_box {
    padding-right: 20px;
    padding-left: 10px;
  }
}
.stock_item:hover,
.stock_item:active{
    background-color: #f5f5f5;
}
.stock_item_crypto {
  display: flex;
  align-items: center;
  height: 50px;
  padding-left: 16px;
  position: relative;
  margin-bottom: 9px;

  ::after {
    content: "";
    width: calc(100% - 30px);
    position: absolute;
    bottom: 0;
    left: 15px;
    height: 1px;
    background-color: #eff3f8;
  }
  .td5 {
    flex: 5;
    flex-shrink: 0;
    overflow: hidden;

    .item_name {
      font-size: 16px;
      color: #061023;
      line-height: 23px;
      font-weight: 500;
    }

    .item_info {
      font-size: 14px;
      line-height: 18px;
      color: #8f92a1;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      padding-right: 20px;
    }
  }

  .td2 {
    flex-shrink: 0;
    flex: 2;
    overflow: hidden;

    .item_num {
      font-size: 15px;
      font-weight: 600;
      line-height: 15px;
      color: #6c7b90;
    }

    .item_info_box {
      margin-top: 5px;
      .item_percent {
        text-align: center;
        width: 50px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        display: inline-block;
        font-weight: 600;
        color: #fff;
        border-radius: 6px;
      }

      .nodata_percent {
        background-color: #6c7b90;
      }
    }
  }

  .td_r {
    text-align: right;
  }

  .spark_line_box {
    padding-right: 20px;
    padding-left: 10px;
  }
}
.stock_item_up {
  background-color: rgba(24, 183, 98, 0.12);

  .stock_item {
    border-bottom: 1px solid rgba(24, 183, 98, 0.12);
  }
}

.stock_item_down {
  background-color: rgba(250, 100, 102, 0.12);

  .stock_item {
    border-bottom: 1px solid rgba(250, 100, 102, 0.12);
  }
}


// 涨跌效果
.up {
  color: #03BC59 !important;
}

.up_bg {
  background-color: #03BC59 !important;
}

.down_bg {
  background-color: #F33764 !important;
}

.down {
  color: #F33764 !important;
}

</style>
