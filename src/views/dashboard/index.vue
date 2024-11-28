<template>
    <AgentMy  :showList="false" v-if="isAgent" />
    <DashboardMain v-else />
</template>

<script>
export default { name: 'Dashboard' }
</script>
<script setup>
import DashboardMain from './components/dashboardMain.vue'
import AgentMy from '../statistics/agentMy.vue'

import { useUserStore } from '/@/store'
import { computed } from 'vue'

const userStore = useUserStore()
const isAgent = computed(() => userStore.userInfo.role.includes('agent'))
</script>
