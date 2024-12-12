<template>
   <el-dialog :close-on-click-modal="false" width="500" class="market-quotations-popup" v-model="show" :append-to-body="true"
    @closed="emit('close', false)">
    <div class="market-popup">
      <el-icon size="20px" class="market-popup__close" @click="show=false;"><Close /></el-icon>
      <MarketInfo type="constract" :symbol="symbol" v-if="symbol" /> 
    </div>
  </el-dialog>
</template>

<script setup>
import MarketInfo from '../../../components/market/MarketInfo.vue'
import {Close} from '@element-plus/icons-vue'
const props = defineProps({
  symbol: { // 行数据
    type: String,
    default: () => ''
  }
})
const show = ref(true)
</script>

<style lang="scss" scoped>
.market-popup{
  background-color: #fff;
  height: 640px;
  top:0;
  border-radius: var(--el-dialog-border-radius);
  
}

.market-popup__close{
  position: absolute;
  right: 0;
  top:0;
  height: 60px;
  width: 50px;
  cursor: pointer;
  text-align: center;
  z-index: 1;
}
</style>
<style>
.market-quotations-popup .el-dialog__header{
  display: none;
}
.market-quotations-popup .el-dialog__body{
  padding: 0px;
}
.market-quotations-popup .marketinfo .info_header .top{
  height: 60px;
}
.market-quotations-popup .marketinfo .info_header .top .title{
  padding-right: 50px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  
}
</style>
