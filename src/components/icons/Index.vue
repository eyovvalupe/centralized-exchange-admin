<template>
    <span class="icon" :style="{width:size,height:size}">
        <HomeIcon :color="color" v-if="name == 'home'" />
        <BusinessIcon :color="color" v-else-if="name == 'business'" />
        <DataIcon :color="color" v-else-if="name == 'data'" />
        <FinancialIcon :color="color" v-else-if="name == 'financial'" />
        <SettingIcon :color="color" v-else-if="name == 'setting'" />
        <SystemIcon :color="color" v-else-if="name == 'system'" />
        <TradeIcon :color="color" v-else-if="name == 'trade'" />
        <RechargeIcon :color="color" v-else-if="name == 'recharge'" />
        <WithdrawIcon :color="color" v-else-if="name == 'withdraw'" />
        <RealnameIcon :color="color" v-else-if="name == 'realname'" />
        <ServiceIcon :color="color" v-else-if="name == 'service'" />
    </span>
</template>
<script setup>
import HomeIcon from './HomeIcon.vue'
import BusinessIcon from './BusinessIcon.vue'
import DataIcon from './DataIcon.vue'
import FinancialIcon from './FinancialIcon.vue'
import SettingIcon from './SettingIcon.vue'
import SystemIcon from './SystemIcon.vue'
import TradeIcon from './TradeIcon.vue'
import RechargeIcon from './RechargeIcon.vue'
import WithdrawIcon from './WithdrawIcon.vue'
import RealnameIcon from './RealnameIcon.vue'
import ServiceIcon from './ServiceIcon.vue'
defineProps({
    name:String,
    color:String,
    size:{
        type:String,
        default:'36px'
    }
})
</script>

<style lang="scss" scoped>
.icon :deep(svg){
    width: 100%;
    height: 100%;
}
</style>